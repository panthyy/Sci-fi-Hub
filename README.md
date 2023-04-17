# Sci-Fi Hub

Sci-Fi Hub is a website that allows users to discover and learn more about sci-fi movies and shows, as well as their lore and cast members. The application is built using React and TypeScript, and bundled with RSPack. The server is hosted on Cloudflare Workers, with data stored in Cloudflare KV and D1.

## Getting Started
To get started with Sci-Fi Hub, you'll need to clone the repository to your local machine and install the necessary dependencies:

```bash
git clone git@github.com:panthyy/Sci-fi-Hub.git
cd Sci-fi-Hub
yarn install
```

Once you have the repository cloned and the dependencies installed, you can start the development server by running:

```bash
yarn dev
```

Your server and client should be running now, and you can access the application at `localhost:3000`.

## Configuration
Sci-Fi Hub uses a few environment variables to configure the application. You can find these in the `wrangler.toml` file. The variables are in the server folder inside the `wrangler.toml` file.

The variables are:

```toml


[[kv_namespaces]]
binding = 
id = 
preview_id =
local = 



[[ d1_databases ]]
binding =
database_name = 
database_id = 
migrations_dir =
```

## Seeding the Database
Sci-Fi Hub uses a database to store information about movies and shows. You can find that information in the `fixtures/seeding folder` including some scripts to help scraping, extracting and cleaning the data.

To seed the database, you'll need to run the following commands:

```bash
yarn db:seed
```

## Generating migrations
Sci-Fi Hub uses the drizzle orm to manage database migrations. You can find the migrations in the `server/drizzle` folder.

To generate a new migration, you'll need to run the following commands in the `server` folder:

```bash
yarn db:generate
```

## Executing migrations
Sci-Fi Hub uses the drizzle orm to manage database migrations. You can find the migrations in the `server/drizzle` folder.

To run the migrations, you'll need to run the following commands in the `server` folder:

```bash
yarn db:migrate
```
# Testing the application
To test the application, you'll need to run the following commands:

```bash
yarn test
```
