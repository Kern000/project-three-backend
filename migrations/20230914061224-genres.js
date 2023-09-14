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
  await db.createTable('genres',{
    "id":       {
                  "type":"int",
                  "primaryKey": true,
                  "autoIncrement": true,
                  "notNull": true
                },
    "genre":    {
                  "type":"string"
                }
  })
  await db.insert('genres', ['genre'], ['fantasy']);
  await db.insert('genres', ['genre'], ['drama']);
  await db.insert('genres', ['genre'], ['romance']);
  await db.insert('genres', ['genre'], ['comedy']);
  await db.insert('genres', ['genre'], ['animal']);
  await db.insert('genres', ['genre'], ['selfhelp']);
  await db.insert('genres', ['genre'], ['business']);
  await db.insert('genres', ['genre'], ['biography']);
  await db.insert('genres', ['genre'], ['art']);
  return await db.insert('genres', ['genre'], ['coding']);
};

exports.down = function(db) {
  return db.dropTable('genres');
};

exports._meta = {
  "version": 1
};
