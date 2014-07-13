var testConfig = process.env.KNEX_TEST && require(process.env.KNEX_TEST) || {};
var _          = require('lodash');
var Promise    = require('bluebird');

var pool = {
  afterCreate: function(connection, callback) {
    expect(connection).to.have.property('__cid');
    callback(null, connection);
  },
  beforeDestroy: function(connection) {
    expect(connection).to.have.property('__cid');
  }
};

var migrations = {
  directory: __dirname + '/integration/migrate/migration'
};

module.exports = {

  maria: {
    dialect: 'maria',
    connection: testConfig.maria || {
      database: "knex_test",
      user: "root",
      charset: 'utf8',
      host: 'localhost'
    },
    migrations: migrations
  },

  mysql: {
    dialect: 'mysql',
    connection: testConfig.mysql || {
      database: "knex_test",
      user: "root",
      charset: 'utf8'
    },
    pool: _.extend({}, pool, {
      afterCreate: function(connection, callback) {
        Promise.promisify(connection.query, connection)("SET sql_mode='TRADITIONAL';", []).then(function() {
          callback(null, connection);
        });
      }
    }),
    migrations: migrations
  },

  mysql2: {
    dialect: 'mysql2',
    connection: testConfig.mysql || {
      database: "knex_test",
      user: "root",
      charset: 'utf8'
    },
    pool: _.extend({}, pool, {
      afterCreate: function(connection, callback) {
        Promise.promisify(connection.query, connection)("SET sql_mode='TRADITIONAL';", []).then(function() {
          callback(null, connection);
        });
      }
    }),
    migrations: migrations
  },


  postgres: {
    dialect: 'postgres',
    connection: testConfig.postgres || {
      adapter:  "postgresql",
      database: "knex_test",
      user:     "postgres"
    },
    pool: pool,
    migrations: migrations
  },

  sqlite3: {
    dialect: 'sqlite3',
    connection: {
      filename: __dirname + '/test.sqlite3'
    },
    pool: _.extend({}, pool, {
      max: 2
    }),
    migrations: migrations
  }

};