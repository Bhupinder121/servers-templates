// let socketServerUrl = "https://tesl-server.herokuapp.com";
let socketServerUrl = "http://192.168.0.118:4068"
let privateServer = "http://192.168.0.118:420";

let socket = require('socket.io-client')(socketServerUrl);
const superagent = require('superagent');

socket.on('connect', function(){
    console.log("connected");
});

socket.on('disconnect', function(){
    console.log("connection lost");
});

socket.on("page-request", function(data){
    let path = data.Pathname;
    let method = data.method;
    let params = data.query;

    let serverURL = privateServer + path;
    if(method == "get"){
        executeGet(serverURL, params);
    }
    else if(method == "post"){
        executePost(serverURL, params);
    }
});

function executeGet(serverURL, params){
    superagent.get(serverURL)
    .query(params)
    .end((err, response)=>{
        if(err){
            console.log("err");
        }
        else{
            socket.emit('page-response', response.text);
        }
    });
}

function executePost(serverURL, params){
    superagent.post(serverURL)
    .query(params)
    .end((err, response)=>{
        if(err){
            console.log(err);
        }
        else{
            socket.emit('page-response', response.text);
        }
    });
}