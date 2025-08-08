import dotenv from 'dotenv';
import pg from 'pg';
import knex from 'knex';
import knexConfig from 'knexfile.js';

dotenv.config();
const { Pool } = pg;

if(!knexConfig.client){
    throw new Error("Database client is not specified in knexfile.js");
}

const knex = knex(knexConfig)

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

export { pool };