/** Setup Simple Express Server **/
var app = require("express")();
var express = require("express");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");

/** Setup Correct path **/
var appPath = path.join(__dirname, "../app");

/** Allow the app to access /assets **/
app.use("/assets", express.static(appPath + "/assets"));

/** Present the user with index.html when they visit / **/
app.get("/", function(req, res){
    res.sendFile(appPath + "/index.html");
});

/** When socket.io detects a connection **/
io.on("connection", function(socket){
    /** Core Functionality **/

    /**
     * TODO- Add User functionality (EG/ @jake)
     */

    /**
     * When the "sendchat" event has triggered, Lets update the chat view!
     */
    socket.on("sendchat", function(msg){
        io.emit("updatechat", msg);
    });
});

/**
 * Set the server to listen to port 3000
 */
http.listen(3000, function(){
    console.log("listening on *:3000");
});
