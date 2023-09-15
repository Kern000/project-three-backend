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
  return db.createTable('sessions', {
    'id': {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      notNull: true
    },
    'session': {
      type: 'string',
      notNull: true
    },
    'super_admin_id':{
      type: 'int',
      foreignKey:{
        name:"super_admin_session_fk",
        table: "super_admin",
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
  await db.removeForeignKey('sessions', 'super_admin_session_fk')
  return db.dropTable('sessions');
};

exports._meta = {
  "version": 1
};
