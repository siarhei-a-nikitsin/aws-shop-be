import { Client } from "pg";

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const defaultDbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
};

export const createClient = (dbOptions = {}) =>
  new Client({ ...defaultDbOptions, ...dbOptions });
