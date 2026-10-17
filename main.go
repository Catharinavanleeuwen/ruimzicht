package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

const scheduleKey = "ruimzicht/schedule.json"

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	persister, err := newPersister(ctx)
	if err != nil {
		log.Fatalf("storage: %v", err)
	}

	loadCtx, cancel := context.WithTimeout(ctx, 20*time.Second)
	store, err := NewStore(loadCtx, persister)
	cancel()
	if err != nil {
		log.Fatalf("store: %v", err)
	}

	srv := &http.Server{
		Addr:              ":" + envOr("PORT", "8080"),
		Handler:           routes(store, envOr("STATIC_DIR", "web/dist")),
		ReadHeaderTimeout: 10 * time.Second,
	}

	go func() {
		log.Printf("listening on %s", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("server: %v", err)
		}
	}()

	<-ctx.Done()
	shutdownCtx, cancelShutdown := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelShutdown()
	_ = srv.Shutdown(shutdownCtx)
}

func newPersister(ctx context.Context) (Persister, error) {
	bucket := os.Getenv("S3_BUCKET")
	if bucket == "" {
		log.Println("S3_BUCKET not set: keeping the schedule in memory only")
		return &MemoryPersister{}, nil
	}
	return NewS3Persister(ctx, bucket, scheduleKey)
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
