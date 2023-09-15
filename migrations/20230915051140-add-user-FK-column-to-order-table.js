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
  return db.addColumn('order_items', 'user_id', 
    {
      type:"int",
      defaultValue: 1,
      foreignKey:{
        name:"user_order_items_fk",
        table: "users",
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
  await db.removeForeignKey("order_items", "user_order_items_fk");
  return await db.removeColumn("order_items", "user_id")
};

exports._meta = {
  "version": 1
};
