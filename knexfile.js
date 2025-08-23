// Update with your config settings.


require('dotenv').config();

/**
 * @type { Object.<string, import('knex').Knex.Config> }
 */

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5434,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      ssl: false
    },
    migrations: {
        directory: './db/migrations',
      },
    seeds: {
        directory: './db/seeds',
      },
  },
  ci: {
    client: 'pg',
    connection: {
      host: 'postgres', // Using the service name as the host
      port: 5434,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  }

};
