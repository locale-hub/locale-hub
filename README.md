# LocaleHub

This project was generated using [Nx](https://nx.dev).

## Requirements

- Node: `14.x`
- yarn: `1.22.19`

## Development environment

### Run MongoDB

```shell
docker run -d --name locale-hub-mongodb -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=lh-user \
    -e MONGO_INITDB_ROOT_PASSWORD=lh-password \
    mongo
```

### Run Redis

```shell
docker run --name locale-hub-redis -p 6379:6379 -d redis
```

### Run Portal

- `yarn` (install dependencies)
- Fill `config/global.config.ts` with your values
- `yarn init-db`
- `yarn start` (start all apps)

For easier debugging you might prefer running apps individually

- Portal API: `npx nx run portal-api:serve`
- Portal Web: `npx nx run portal-web:serve`
