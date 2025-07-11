import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()
const mode = process.argv[2]
const outDir = mode === 'dev' ? path.resolve(process.cwd(), 'public') : path.resolve(process.cwd(), 'dist')
const config = {
    ENVIRONMENT: process.env.ENVIRONMENT,
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_ID_LOCAL: process.env.KEYCLOAK_CLIENT_ID_LOCAL,
    KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
    KEYCLOAK_URL: process.env.KEYCLOAK_URL,
    KRONOS_API_KEY: process.env.KRONOS_API_KEY,
    KRONOS_URL: process.env.KRONOS_URL,
    MAESTRO_URL: process.env.MAESTRO_URL,
}
fs.writeFileSync(path.join(outDir, 'config.json'), JSON.stringify(config, null, 2), 'utf-8');
console.log(`✔ runtime config written to ${outDir}/config.json`)