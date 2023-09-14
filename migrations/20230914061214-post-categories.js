'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  await db.createTable('post_categories',{
    "id":       {
                  "type":"int",
                  "primaryKey": true,
                  "autoIncrement": true,
                  "notNull": true
                },
    "category": {
                  "type":"string"
                }
  })

  await db.insert('post_categories', ['category'], ['free']);
  await db.insert('post_categories', ['category'], ['webnovel']);
  await db.insert('post_categories', ['category'], ['published']);
  return await db.insert('post_categories', ['category'], ['manuscript']);
};

exports.down = function(db) {
  return db.dropTable('post_categories');
};

exports._meta = {
  "version": 1
};
