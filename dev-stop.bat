@echo off
echo Stopping dev containers...
docker compose -f docker-compose.dev.yml down
echo Done. Containers stopped. Data preserved.
echo To also delete database data: docker compose -f docker-compose.dev.yml down -v
