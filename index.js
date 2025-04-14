const express = require("express");


const app = express();


app.get("/", (req , res )=>{
    res.send("Hello From Digital Ocean Server Coz mine azure free tier expired🥲");
})


app.listen(3100, ()=>{
    console.log("Server is running on port 3100");
})







