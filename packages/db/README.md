# DB

This package contains the database schema and migration scripts for The Lokals Platform. It is responsible for creating and updating the database tables.

## Getting Started

To get started with the database, you will need to have [Docker](https://www.docker.com/) installed.

Once you have Docker installed, you can start the database by running the following command:

```bash
docker-compose up -d
```

This will start a PostgreSQL database in a Docker container.

## Running Migrations

To run the database migrations, you can use the following command:

```bash
pnpm migrate
```

This will apply any pending migrations to the database.
