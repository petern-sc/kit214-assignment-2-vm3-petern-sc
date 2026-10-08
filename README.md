# kit214-assignment-2-vm3-petern-sc

## References

### Libraries used

- Express: API server
- Knex: DB library
- Zod: Handles encoding/decoding. Saves me having to handroll the validation for each model

### Other

### HTTPS configuration

- Configured via express. When `APP_ENV=development` skips TLS setup for local dev. Setting APP_ENV to anything else will run express with https.

### Running

- `npm run dev` runs the TypeScript source directly and restarts the server when source files change; no build is needed.
- `npm run build` compiles the source into `dist/`.
- `npm start` runs the compiled `dist/server.js`, so rebuild after changing source before using it.
