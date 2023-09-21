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
  await db.createTable("order_items", {
    order_id: { 
      type: "int"
    },
    cart_id:{
      type: "int"
    },
    user_id: {
      type: "int"
    },
    product_id: {
      type: "int"
    },
    product_name: {
      type: "string"
    },
    seller_id: {
      type: "int"
    },
    price:{
      type: "int"
    },
    quantity: { 
      type: "int", 
      unsigned: true 
    },
    date_time:{
      type: "date"
    },
    fulfilled: {
      type: "string"
    }
  });

  await db.insert("order_items", ["order_id", "cart_id","user_id","product_id","product_name","seller_id","price","quantity", "date_time", "fulfilled"], [1, 1, 3, 4, "How can I live with you", 2, 10, 10, "2023-04-04", "No"])
  await db.insert("order_items", ["order_id", "cart_id","user_id","product_id","product_name","seller_id","price","quantity", "date_time", "fulfilled"], [1, 1, 3, 5, "meow1", 3, 19, 8, "2023-04-04", "No"])

  await db.insert("order_items", ["order_id", "cart_id","user_id","product_id","product_name","seller_id","price","quantity", "date_time", "fulfilled"], [2, 2, 2, 1, "Oppenheimer", 1, 50, 3, "2023-01-01", "No"])
  await db.insert("order_items", ["order_id", "cart_id","user_id","product_id","product_name","seller_id","price","quantity", "date_time", "fulfilled"], [2, 2, 2, 5, "meow1", 3, 19, 4, "2023-01-01", "No"])
  await db.insert("order_items", ["order_id", "cart_id","user_id","product_id","product_name","seller_id","price","quantity", "date_time", "fulfilled"], [2, 2, 2, 2, "Why cats are our owners", 2, 10, 5, "2023-01-01", "No"])

};

exports.down = function(db) {
  return db.dropTable("order_items");
};


exports._meta = {
  "version": 1
};
