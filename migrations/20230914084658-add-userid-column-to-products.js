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
  return await db.addColumn('products', 'user_id',
  {
    "type":"int",
    "foreignKey":{
      "name": "user_product_fk",
      "table": "users",
      "mapping": "id",
      "rules": {
        "onDelete": "cascade",
        "onUpdate": "restrict"
      }
    }
  })
}

exports.down = async function(db) {
  await db.removeForeignKey('products', 'user_product_fk');
  return await db.removeColumn('products', 'user_id');
};

exports._meta = {
  "version": 1
};
