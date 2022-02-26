var os = require('os');
var ip = require('ip');
let address = os.networkInterfaces()["Ethernet"][1]['address'];
// let address = ip.address();

let socketServerUrl = "https://tesl-server.herokuapp.com";
let remainderServer = "http://"+address+":421";
let financeServer = "http://"+address+":420";



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
    let params = data.query.data_query;
    let serverName = data.query.server;
    let serverURL = remainderServer + path;
    
    if(method == "post"){
        serverName = data.query.nameValuePairs.server;
    }
    if(serverName == "finance"){
        serverURL = financeServer + path;
    }
    
    if(method == "get"){
        executeGet(serverURL, params);
    }
    else if(method == "post"){
        params = data.query;
        executePost(serverURL, params);
    }
});

function executeGet(serverURL, params){
    superagent.get(serverURL)
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