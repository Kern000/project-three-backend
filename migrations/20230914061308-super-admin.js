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
  await db.createTable('super_admin',
    {
      "id":     {
                  "type":"int",
                  'primaryKey': true,
                  "autoIncrement": true,
                  "notNull": true
                },
      "name":   {
                  "type":"string",
                  "length": 255,
                  "notNull": true
                },
      "email":  {
                  "type":"string",
                  "length": 255,
                  "notNull": true
                },
      "password": {
                  "type":"string",
                  "length": 255,
                  "notNull": true 
                  }
    }
  )
  return await db.insert('super_admin', ['name','email','password'], ['super1', 'super1@gmail.com', 'unhashedpasswordforsuper'])
};

exports.down = function(db) {
  return dropTable('super_admin')
};

exports._meta = {
  "version": 1
};
