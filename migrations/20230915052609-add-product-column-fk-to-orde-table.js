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
  return db.addColumn('order_items', 'product_id', 
    {
      type:"int",
      defaultValue: 1,
      foreignKey:{
        name:"product_order_item_fk",
        table: "products",
        mapping: "id",
        rules: {
          onDelete: "cascade",
          onUpdate: "restrict"
        }
      }
    }
  )
};

exports.down = async function(db) {
  await db.removeForeignKey('order_items', 'product_order_item_fk');
  return await db.removeColumn('order_items', 'product_id');
};

exports._meta = {
  "version": 1
};
