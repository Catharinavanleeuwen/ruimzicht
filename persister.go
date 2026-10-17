package main

import (
	"context"
	"sync"
)

// Persister stores the whole schedule as one JSON document.
type Persister interface {
	// Load returns nil, nil when nothing has been saved yet.
	Load(ctx context.Context) ([]byte, error)
	Save(ctx context.Context, data []byte) error
}

// MemoryPersister keeps the document in memory (local development, tests).
type MemoryPersister struct {
	mu   sync.Mutex
	data []byte
}

func (m *MemoryPersister) Load(_ context.Context) ([]byte, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	return append([]byte(nil), m.data...), nil
}

func (m *MemoryPersister) Save(_ context.Context, data []byte) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.data = append([]byte(nil), data...)
	return nil
}
