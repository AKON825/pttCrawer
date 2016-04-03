var config = require('./config/parameters')

module.exports = {
  development: {
    debug: true,
    client: 'mysql',
    connection: {
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name
    }
  },
  pool: {
    max: 1
  }
}
