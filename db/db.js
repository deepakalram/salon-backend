import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config({
    path: `./env/${process.env.NODE_ENV}.env`
});

export const db = knex({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    debug: false, 
    pool: {
        min: 1,
        max: 200
    }
});

export default db;