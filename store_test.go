package main

import (
	"context"
	"errors"
	"testing"
)

func TestStoreLifecycle(t *testing.T) {
	ctx := context.Background()
	p := &MemoryPersister{}
	s, err := NewStore(ctx, p)
	if err != nil {
		t.Fatal(err)
	}
	sched, err := s.AddPerson(ctx, " Sanne ", "terra")
	if err != nil {
		t.Fatal(err)
	}
	if len(sched.People) != 1 || sched.People[0].Name != "Sanne" {
		t.Fatalf("unexpected people: %+v", sched.People)
	}
	id := sched.People[0].ID
	sched, err = s.SetSlot(ctx, id, 2, 1, "thuis")
	if err != nil {
		t.Fatal(err)
	}
	if sched.Slots[slotKey(id, 2, 1)] != "thuis" {
		t.Fatalf("slot not set: %+v", sched.Slots)
	}

	reloaded, err := NewStore(ctx, p)
	if err != nil {
		t.Fatal(err)
	}
	if snap := reloaded.Snapshot(); len(snap.People) != 1 || len(snap.Slots) != 1 {
		t.Fatalf("reload lost data: %+v", snap)
	}

	sched, err = s.RemovePerson(ctx, id)
	if err != nil {
		t.Fatal(err)
	}
	if len(sched.People) != 0 || len(sched.Slots) != 0 {
		t.Fatalf("remove left data: %+v", sched)
	}
}

func TestStoreValidation(t *testing.T) {
	ctx := context.Background()
	s, _ := NewStore(ctx, &MemoryPersister{})
	var ie *InputError

	if _, err := s.AddPerson(ctx, "  ", "terra"); !errors.As(err, &ie) {
		t.Fatalf("empty name: %v", err)
	}
	if _, err := s.AddPerson(ctx, "Tom", "neon"); !errors.As(err, &ie) {
		t.Fatalf("bad color: %v", err)
	}
	sched, err := s.AddPerson(ctx, "Tom", "sky")
	if err != nil {
		t.Fatal(err)
	}
	if _, err := s.AddPerson(ctx, "tom", "sage"); !errors.As(err, &ie) {
		t.Fatalf("duplicate: %v", err)
	}
	id := sched.People[0].ID
	if _, err := s.SetSlot(ctx, id, 7, 0, "thuis"); !errors.As(err, &ie) {
		t.Fatalf("bad day: %v", err)
	}
	if _, err := s.SetSlot(ctx, id, 0, 0, "slapen"); !errors.As(err, &ie) {
		t.Fatalf("bad status: %v", err)
	}
	if _, err := s.SetSlot(ctx, "nobody", 0, 0, "weg"); !errors.Is(err, ErrNotFound) {
		t.Fatalf("unknown person: %v", err)
	}
}
