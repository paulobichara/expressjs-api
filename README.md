# Express.js API

This project is under construction! :) It is a simple [Express](https://expressjs.com/) API, using mainly [Prisma](https://www.prisma.io/) as ORM and [Jest](https://jestjs.io/) and [Supertest](https://github.com/visionmedia/supertest) for testing. The database of choice was PostgreSQL.

## Local Infrastructure

This project includes a `infra` directory including the definition file `docker-compose.yaml` with the required local infra to run the application.

The containers included in the docker-compose cluster are:

- PostgreSQL - database for the API
- PgAdmin4 - for managing and querying the database (available at <http://localhost/>)

To run the local infrastructure just start the docker-compose cluster by running:

```shell script
docker-compose -f infra/docker-compose.yaml up -d
```

## Testing

To run all the tests, just execute:

```shell script
npm run test
```

In case you want to check the test coverage report, use the following:

```shell script
npm run coverage
```

## Running

After the infrastructure is running and the application is built, we can run it by executing, from the project root directory:

```shell script
npm start
```
