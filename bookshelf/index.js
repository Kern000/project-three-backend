const knex = require("knex")({
    client:"mysql",
    connection:{
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST
    }
})

const bookshelf = require("bookshelf")(knex)

module.exports = bookshelf;