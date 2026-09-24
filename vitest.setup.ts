import { loadEnvConfig } from '@next/env'

// .env holds production values; .env.local (local database) takes precedence.
loadEnvConfig(process.cwd())
