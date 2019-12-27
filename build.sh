# Create network for deploy
docker network create edu_network

# Start mongo db
docker-compose -f mongodb-compose.yml up -d

# Wait for mongo db start complete
sleep 10

#Start api
docker build -f DockerfileApi -t edu_api:1.0 .
docker-compose -f api-compose.yml up -d




