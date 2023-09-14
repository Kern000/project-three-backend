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
  await db.createTable('orders_users', 
  {
    "id": {
      type: "int",
      primaryKey: true,
      autoIncrement: true
    },
    "order_id": {
      "type":"int",
      "foreignKey":{
        "name": "orders_users_order_fk",
        "table": "order_items",
        "mapping": "id",
        "rules": {
          "onDelete": "cascade",
          "onUpdate": "restrict"
        }
      }
    },
    "user_id": {
      "type":"int",
      "foreignKey":{
        "name": "orders_users_user_fk",
        "table": "users",
        "mapping": "id",
        "rules": {
          "onDelete": "cascade",
          "onUpdate": "restrict"
        }
      }
    }
  })
}

exports.down = async function(db) {
  await db.removeForeignKey('orders_users', 'orders_users_user_fk');
  await db.removeForeignKey('orders_users', 'orders_users_order_fk');
  return await db.dropTable('orders_users');
};

exports._meta = {
  "version": 1
};
