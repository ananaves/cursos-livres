REM limpa o cache do docker
docker compose build --no-cache

REM sobe todos os containers
docker compose up -d