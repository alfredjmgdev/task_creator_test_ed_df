# Epi data Task test

A full-stack application designed for Reservation System, built with React + Next.js and Pyhton + Fastapi.

## 🚀 Tech Stack

### Frontend

- React.js with Next.js
- Tailwind CSS for styling
- App Router for navigation
- React Context for state management

### Backend

- Python
- Fastapi

#### Arquitecture

For this it was used hexagonal architecture with clean architecture

### Database

- MySQL as a database.
- SQLAlchemy as an ORM.

## ⚙️ Prerequisites

- Docker and docker-compose installed.

## 🛠️ Installation

1. Clone the repository
2. Rename the files:

- 'epidata_test_be/.env.example' to 'epidata_test_be/.env'
- 'epidata_test_fe/.env.example' to 'epidata_test_fe/.env'

3. Run `docker-compose up --build -d` create the containers and run the application.
4. Go to `http://localhost:3000` to see the application.

## 📚 Documentation

It can be found the backend API documentation after running the application on this link:
`http://localhost:8000/docs/`

#### Testing

It was used Pytest in the backend for unit testing. To run the unit tests, it can be used the following commands:

`docker exec -it epidata_backend /bin/bash`

`pytest tests/unit/ -v`
