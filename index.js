const express = require("express");
const client = require('prom-client');

const app = express();
const port = 3100;
const metricsPort = 3101;

app.get("/", (req , res )=>{
    res.send("Hello🥲<br>A small change to test the deployment");
})


// Prom Metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

app.get("/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
})


app.listen(port, ()=>{
    console.log("Server is running on port 3100");
    require('http').createServer(app).listen(metricsPort, ()=>{
        console.log("Metrics server is running on port 3101");
    })
})







