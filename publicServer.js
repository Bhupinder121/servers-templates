const express = require('express');
const socket = require('socket.io');
const http = require('http');
var body = require('body-parser');


let port = process.env.YOUR_PORT || process.env.PORT || 4068;

let app = express();



let server = app.listen(port, ()=>{
    console.log('listening on port 420');
});

let io  = socket(server);

app.use(body.json())

let clientResponseRef;



io.on('connection', (socket) => {
    console.log("A node connection");
    socket.on('page-response', (response) =>{
        if(clientResponseRef != null){
            clientResponseRef.status(200).send(response);
            clientResponseRef = null;
        }
    });
});


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
