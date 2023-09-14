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
  
  await db.createTable("products",
    { "id":             {
                          "type":"int",
                          "primaryKey":true,
                          "autoIncrement": true,
                        },
      "name":           {
                          "type":"string",
                          "length": 555,
                          "notNull": true
                        },
      "price":          {
                          "type":"int",
                          "unsigned": true
                        },
      "description":    {
                          "type":"string",
                          "length": 1000,
                          "notNull": true
                        },
      "image_url":      {
                          "type":"string",
                          "length": 255
                        },
      "thumbnail_url":  {
                          "type":"string",
                          "length": 255
                        },
      "date_created":   {
                          "type":"date"
                        },
      "stock":          {
                          "type":"int",
                          "unsigned": true
                        },
      "chapter_content":{
                          "type":"text"
                        },
      "quantity_sold":  {
                          "type":"int",
                          "unsigned": true
                        }
    }
  )
  
  await db.insert('products',['name','price','description','date_created','stock','chapter_content','quantity_sold'],['Oppenheimer', '0', 'Biography of Oppenheimer', '2023-09-14', '10', 'This is the chapter content made free', '0'])
  await db.insert('products',['name','price','description','date_created','stock','chapter_content','quantity_sold'],['Why cats are our owners', '0', 'How cats overlords ruled the world', '2023-09-14', '5', 'This is the chapter content made free', '0'])
  return await db.insert('products',['name','price','description','date_created','stock','chapter_content','quantity_sold'],['We are the champions', '0', 'My friend', '2023-09-14', '8', 'This is the chapter content made free', '0'])
}

exports.down = async function(db) {
  return db.dropTable('products');
};

exports._meta = {
  "version": 1
};
