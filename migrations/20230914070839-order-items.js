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

exports.up = function(db) {
  return db.createTable('order_items',{
    id:{
      type:"int",
      primaryKey: true,
      autoIncrement: true
    },
    order_fulfilment:{
      type:"string",
      defaultValue:"false",
      length:10
    },
    cart_id:{
      type:"int",
      notNull: true,
      foreignKey:{
        name:"order_items_cart_fk",
        table: "cart_items",
        mapping: "id",
        rules: {
          onDelete: "cascade",
          onUpdate: "restrict"
        }
      }
    }
  })
};

exports.down = async function(db) {
  await db.removeForeignKey('order_items', 'order_items_cart_fk');
  return db.dropTable('order_items');
};

exports._meta = {
  "version": 1
};
