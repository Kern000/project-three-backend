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
  await db.createTable('users',{
    "id":           {
                      "type":"int",
                      "primaryKey": true,
                      "autoIncrement": true,
                      "notNull": true
                    },
    "name":         {
                      "type":"string",
                      "length":255,
                      "notNull": true
                    },
    "email":        {
                      "type":"string",
                      "length":255,
                      "notNull": true
                    },
    "password":     {
                      "type":"string",
                      "length":255,
                      "notNull": true   
                    },
    "secret":       {
                      "type":"string",
                      "length":255,
                      "notNull": true
                    },
    "session":      {
                      "type":"string",
                      "length":1000
                    },
    "sales":        {
                      "type":"int"
                    }
  })

  await db.insert("users", ["name", "email", "password", "secret"], ['meow', "meow123@gmail.com", "unhashedpassword", "Cordon Bleu"]);
  return await db.insert("users", ["name", "email", "password", "secret"], ['woof', "woof123@gmail.com", "unhashedpassword", "Harvard"]);
};

exports.down = function(db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};
