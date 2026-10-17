package main

import (
	"context"
	"fmt"
	"slices"
	"strings"
	"unicode/utf8"
)

func (s *Store) AddPerson(ctx context.Context, name, color string) (Schedule, error) {
	name = strings.TrimSpace(name)
	if n := utf8.RuneCountInString(name); n == 0 || n > 40 {
		return Schedule{}, invalid("Een naam heeft 1 tot 40 tekens.")
	}
	if !validColors[color] {
		return Schedule{}, invalid("Kies een van de kleuren.")
	}
	id, err := newID()
	if err != nil {
		return Schedule{}, err
	}
	return s.update(ctx, func(d *Schedule) error {
		if len(d.People) >= maxPeople {
			return invalid(fmt.Sprintf("Er passen maximaal %d huisgenoten in het rooster.", maxPeople))
		}
		for _, p := range d.People {
			if strings.EqualFold(p.Name, name) {
				return invalid(fmt.Sprintf("%s staat al in het rooster.", p.Name))
			}
		}
		d.People = append(d.People, Person{ID: id, Name: name, Color: color})
		return nil
	})
}

func (s *Store) RemovePerson(ctx context.Context, id string) (Schedule, error) {
	return s.update(ctx, func(d *Schedule) error {
		idx := slices.IndexFunc(d.People, func(p Person) bool { return p.ID == id })
		if idx < 0 {
			return ErrNotFound
		}
		d.People = slices.Delete(d.People, idx, idx+1)
		prefix := id + ":"
		for k := range d.Slots {
			if strings.HasPrefix(k, prefix) {
				delete(d.Slots, k)
			}
		}
		return nil
	})
}

// SetSlot sets a person's status for one part of one day; "" clears it.
func (s *Store) SetSlot(ctx context.Context, personID string, day, part int, status string) (Schedule, error) {
	if day < 0 || day > 6 || part < 0 || part > 3 {
		return Schedule{}, invalid("Dit dagdeel bestaat niet.")
	}
	if status != "" && !validStatus[status] {
		return Schedule{}, invalid("Kies thuis, weg of misschien.")
	}
	return s.update(ctx, func(d *Schedule) error {
		if !slices.ContainsFunc(d.People, func(p Person) bool { return p.ID == personID }) {
			return ErrNotFound
		}
		key := slotKey(personID, day, part)
		if status == "" {
			delete(d.Slots, key)
		} else {
			d.Slots[key] = status
		}
		return nil
	})
}
