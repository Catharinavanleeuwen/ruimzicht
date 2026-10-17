package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"maps"
	"sync"
)

var ErrNotFound = errors.New("not found")

// InputError carries a message meant for the person using the app.
type InputError struct{ Msg string }

func (e *InputError) Error() string { return e.Msg }

func invalid(msg string) error { return &InputError{Msg: msg} }

var validColors = map[string]bool{"terra": true, "sage": true, "sky": true, "plum": true, "sun": true, "rose": true}
var validStatus = map[string]bool{"thuis": true, "weg": true, "misschien": true}

const maxPeople = 20

type Person struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
}

type Schedule struct {
	People []Person          `json:"people"`
	Slots  map[string]string `json:"slots"`
}

func (s Schedule) clone() Schedule {
	c := Schedule{People: append([]Person{}, s.People...), Slots: make(map[string]string, len(s.Slots))}
	maps.Copy(c.Slots, s.Slots)
	return c
}

func slotKey(personID string, day, part int) string {
	return fmt.Sprintf("%s:%d:%d", personID, day, part)
}

// Store holds the schedule in memory and writes every change through.
type Store struct {
	mu        sync.Mutex
	data      Schedule
	persister Persister
}

func NewStore(ctx context.Context, p Persister) (*Store, error) {
	s := &Store{persister: p, data: Schedule{People: []Person{}, Slots: map[string]string{}}}
	raw, err := p.Load(ctx)
	if err != nil {
		return nil, fmt.Errorf("load schedule: %w", err)
	}
	if len(raw) > 0 {
		var loaded Schedule
		if err := json.Unmarshal(raw, &loaded); err != nil {
			return nil, fmt.Errorf("decode schedule: %w", err)
		}
		if loaded.People != nil {
			s.data.People = loaded.People
		}
		if loaded.Slots != nil {
			s.data.Slots = loaded.Slots
		}
	}
	return s, nil
}

func (s *Store) Snapshot() Schedule {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.data.clone()
}

func (s *Store) update(ctx context.Context, fn func(*Schedule) error) (Schedule, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	next := s.data.clone()
	if err := fn(&next); err != nil {
		return Schedule{}, err
	}
	raw, err := json.Marshal(next)
	if err != nil {
		return Schedule{}, err
	}
	if err := s.persister.Save(ctx, raw); err != nil {
		return Schedule{}, err
	}
	s.data = next
	return next.clone(), nil
}

func newID() (string, error) {
	b := make([]byte, 8)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
