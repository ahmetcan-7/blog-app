#!/bin/bash

# Start Docker containers
echo "Starting Docker containers..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 30

# Check if Keycloak is ready
echo "Checking if Keycloak is ready..."
until curl -s http://localhost:8080/health/ready > /dev/null; do
    echo "Waiting for Keycloak to be ready..."
    sleep 5
done

# Create Keycloak realm and client
echo "Creating Keycloak realm and client..."
pnpm cli create-client

# Create admin user
echo "Creating admin user..."
pnpm cli create-admin admin admin@example.com admin123

echo "Setup completed successfully!" 