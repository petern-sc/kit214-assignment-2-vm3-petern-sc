# kit214-assignment-2-vm3-petern-sc

## References

### Libraries used

- Express: API server
- Knex: DB library
- Zod: Handles encoding/decoding. Saves me having to handroll the validation for each model

### Other

### HTTPS configuration

- Configured via express. When `APP_ENV=development` skips TLS setup for local dev. Setting APP_ENV to anything else will run express with https.
