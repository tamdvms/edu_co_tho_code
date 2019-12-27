# Create network for deploy
docker network create edu_network

# Build api image
docker build -f DockerfileApi -t edu_api:1.0 .

# Build frontend Image
docker build -f DockerfileFrontend -t edu_fe:1.0 .


# Build backend Image
docker build -f DockerfileBackend -t edu_be:1.0 .

# Starting system
docker-compose -f docker-compose.yml up -d





