exports.up = function (knex) {
  var upSql = [
    "CREATE TABLE IF NOT EXISTS `article` (`id` int(11) NOT NULL,`author` text NOT NULL,`title` text NOT NULL,`content` text NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=utf8",
    "ALTER TABLE `article` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT"
  ]

  var migrationKnex

  upSql.forEach(function (query, index) {
    if (index === 0) {
      migrationKnex = knex.schema.raw(upSql[0])

      return
    }

    migrationKnex = migrationKnex.then(function () { return knex.schema.raw(query) })
  })

  return migrationKnex
}

exports.down = function (knex) {
  var downSql = [
    "drop table article"
  ]

  var migrationKnex

  downSql.forEach(function (query, index) {
    if (index === 0) {
      migrationKnex = knex.schema.raw(downSql[0])

      return
    }

    migrationKnex = migrationKnex.then(function () { return knex.schema.raw(query) })
  })

  return migrationKnex
}
