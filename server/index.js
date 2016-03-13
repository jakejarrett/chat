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

/** Users currently connected **/
var usernames = {};

/** When socket.io detects a connection **/
io.on("connection", function(socket){
    /** Core Functionality **/

    /**
     * When the "sendchat" event has triggered, Lets update the chat view!
     */
    socket.on("sendchat", function(msg, username){
        io.emit("updatechat", msg, username);
    });

    /**
     * When a new user joins the chat, Lets store the entered username into sessionStorage and notify the users
     * the user has joined!
     */
    socket.on("newUser", function(username) {
        socket.username = username;

        usernames[username] = socket.id;

        /** notify chat **/
        io.emit("newUser", "SERVER", socket.username);
    });

    socket.on("disconnect", function(){
        if(socket.username !== undefined) {
            // remove the username from global usernames list
            delete usernames[socket.username];
            // update list of users in chat, client-side
            io.sockets.emit("updateusers", usernames);
            // echo globally that this client has left
            socket.broadcast.emit("userDisconnect", "SERVER", socket.username);
        }
    });
});

/**
 * Set the server to listen to port 3000
 */
http.listen(3000, function(){
    console.log("listening on *:3000");
});
