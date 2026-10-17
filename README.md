# kit214-assignment-2-vm3-petern-sc

## VM setup

- install node26
- Run `npm ci` to install dependencies.
- Database setup is in `data/init.sql`.

### Environment configuration
- Copy `.env.example` to `.env` and update the values for the environment.

### HTTPS configuration

- Configured via express. When `APP_ENV=development` skips TLS setup for local dev. Setting APP_ENV to anything else will run express with https.
- Requires `TLS_CERT_PATH` and `TLS_KEY_PATH` to be set. This is pointing to a self signed certificate on the VMs

### Running

- `npm run dev` runs the TypeScript source directly and restarts the server when source files change; no build is needed.
- `npm run build` compiles the source into `dist/`.
- `npm start` runs the compiled `dist/server.js`, so rebuild after changing source before using it.
- `npm run generate:jwt-secrets` generate JWT signing secret

## References

### Libraries used

- Express: API server
- Knex: DB library
- Zod: Handles encoding/decoding. Saves me having to handroll the validation for each model
- jsonwebtoken - JWT
- bcryptjs - Password hashing
- Cheerio - scraping the rooms site
- dotenv - env var loading

## Other

- Booking overlap query: https://stackoverflow.com/questions/25549765/find-booking-overlaps-to-check-dates-availability
- Express error handling: https://expressjs.com/en/5x/guide/error-handling/#the-default-error-handler
- Mysql duplicate key error: https://dev.mysql.com/doc/mysql-errors/8.0/en/server-error-reference.html#error_er_dup_entry

## Generative AI Usage Statement

Generative AI was used in:
- VM setup
  - Setting up HTTPS and integrating it with express
  - Getting pm2 setup so the app reloads on update
  - Adding the cors middleware to allow the website to talk to my APIs
- Code
  - to get the element paths for scraping the static rooms site
  - to help extract common error handlers
  - setting up the db migrations and docker commands for me to local dev
  - setting up vm2 and copying over the shared files from this repo into vm2 repo
  - adding express middleware to return 4xx for invalid json and 404 json for missing routes
  - at the end pointing AI at the OpenAPI docs and identifying parts I've missed

