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
  return db.createTable('genres_products',
    {
      id:{
        type: "int",
        primaryKey: true,
        autoIncrement: true
      },
      product_id:{
        "type":"int",
        "notNull": true,
        "foreignKey":{
          "name": "genres_products_product_fk",
          "table": "products",
          "mapping": "id",
          "rules": {
            "onDelete": "cascade",
            "onUpdate": "restrict"
          }
        }
      },
      genre_id:{
        "type":"int",
        "notNull": true,
        "foreignKey":{
          "name": "genres_products_genre_fk",
          "table": "genres",
          "mapping": "id",
          "rules": {
            "onDelete": "cascade",
            "onUpdate": "restrict"
          }
        }
      }
    }  
  )
};

exports.down = async function(db) {
  await db.removeForeignKey("genres_products", "genres_products_product_fk");
  await db.removeForeignKey("genres_products", "genres_products_genre_fk");
  return db.dropTable("genres_products");
};

exports._meta = {
  "version": 1
};
