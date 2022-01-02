const express = require('express');
const socket = require('socket.io');
const http = require('http');
var body = require('body-parser');

let app = express();
let httpSever = http.createServer(app);
let io  = socket(httpSever);

app.use(body.json())

let clientResponseRef;


app.get('/*', (req, res) =>{
    let pathname = req.url;
    let obj = {
        Pathname : pathname,
        method : "get", 
        query :  req.query
    };
    io.emit("page-request", obj);
    clientResponseRef = res;
});

app.post('/*', (req, res) =>{
    let pathname = req.url;
    let obj = {
        Pathname : pathname,
        method : "post", 
        query :  req.body
    };
    io.emit("page-request", obj);
    clientResponseRef = res;
});

io.on('connection', (socket) => {
    console.log("A node connection");
    socket.on('page-response', (response) =>{
        clientResponseRef.send(response);
    });
});

let port = process.env.YOUR_PORT || process.env.PORT || 4068;

httpSever.listen(port, ()=>{
    console.log("listening on "+ port);
});
