set -euo pipefail

# Backend
rm -f go.sum
go mod tidy
go vet ./...
go build -o /dev/null ./...
go test ./...

# Frontend
cd web
rm -f package-lock.json
npm install
npm run build
cd ..

# Image
docker build .
