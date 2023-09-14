const express = require("express");
const cors = require("cors");
require("dotenv").config();

let app = express();
app.use(cors());


const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("Server started, listening at po")
})