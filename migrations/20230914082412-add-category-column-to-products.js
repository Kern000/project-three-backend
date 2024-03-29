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
  return db.addColumn('products', 'post_category_id',
    {
      "type":"int",
      "defaultValue": 1,
      "foreignKey":{
        "name": "post_category_product_fk",
        "table": "post_categories",
        "mapping": "id",
        "rules": {
          "onDelete": "cascade",
          "onUpdate": "restrict"
        }
      }
    })
};

exports.down = async function(db) {
  await db.removeForeignKey('products', 'post_category_product_fk');
  return db.removeColumn('products', 'post_category_id');
};

exports._meta = {
  "version": 1
};
