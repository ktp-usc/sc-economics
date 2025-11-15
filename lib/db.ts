import { neon } from '@neondatabase/serverless';

const connectionString =
    process.env.NEW_DATABASE_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('Missing database connection string');
}

export const sql = neon(connectionString);