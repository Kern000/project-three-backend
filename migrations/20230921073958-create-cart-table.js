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
  await db.createTable("cart_items", {
    cart_id: { 
      type: "int"
    },
    user_id: {
      type: "int"
    },
    product_id: {
      type: "int",
    },
    product_name:{
      type: "string"
    },
    price:{
      type: "int"
    },
    quantity: { 
      type: "int", 
      unsigned: true 
    },
    date_time: {
      type: "date"
    }
  });

  await db.insert("cart_items", ["cart_id","user_id","product_id","product_name","price","quantity","date_time"], [1, 3, 4, "How can I live with you", 10, 10, "2023-01-01"])
  await db.insert("cart_items", ["cart_id","user_id","product_id","product_name","price","quantity","date_time"], [1, 3, 5, "meow1", 19, 8, "2023-01-01"])

  await db.insert("cart_items", ["cart_id","user_id","product_id","product_name","price","quantity","date_time"], [2, 2, 1, "Oppenheimer", 50, 3, "2023-04-05"])
  await db.insert("cart_items", ["cart_id","user_id","product_id","product_name","price","quantity","date_time"], [2, 2, 5, "meow1", 19, 4, "2023-04-05"])
  await db.insert("cart_items", ["cart_id","user_id","product_id","product_name","price","quantity","date_time"], [2, 2, 2, "Why cats are our owners", 10, 5, "2023-04-05"])
};

exports.down = function(db) {
  return db.dropTable("cart_items");
};

exports._meta = {
  "version": 1
};
