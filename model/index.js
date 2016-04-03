var config = require('../config/parameters')
var dbConfig


dbConfig = {
  client: 'mysql',
  connection: {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name
  },
  pool: {
    min: 0,
    max: 5
  }
}



var path = require('path')
var fs = require('fs')
var knex = require('knex')(dbConfig)
var bookshelf = require('bookshelf')(knex)
var db = { bookshelf: bookshelf, schema: {}, tables: [] }

var stat

fs.readdirSync(__root_dir + '/model').forEach(function (file) {
  if (file === 'index.js') {
    return
  }

  stat = fs.statSync(path.join(__root_dir, '/model', file))
  if (stat.isDirectory()) {
    return
  }

  if (file.match(/^[A-Za-z0-9_]+\.js$/)) {
    var entityClassName = file.replace('.js', '')
    var entityClass = require('./' + entityClassName)()

    db[entityClassName] = bookshelf.Model.extend(entityClass.entityMethod, entityClass.repoMethod)
    db.schema[entityClassName] = entityClass.schema
    db.tables.push(entityClass.entityMethod.tableName)
  }
})

module.exports = db
