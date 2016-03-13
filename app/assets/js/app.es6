/**
 * Chat Application
 *
 * @Author - Jake Jarrett
 * @GitHub URL - https://github.com/jakejarrett/chat-example
 */

"use strict";

/**
 * Import Modules
 *
 * If you're unfamiliar with ES6 Modules, read up about them here
 * @ES6Modules - https://github.com/lukehoban/es6features#modules
 */
import $ from "jquery";
import notifyUser from "./lib/notifications";
import {messageInput, messageContainer} from "./lib/messaging/variables"
import * as messaging from "./lib/messaging";

$(function() {
    /** Focus the message input when we"ve loaded the page, So users can just start chatting! **/
    messageInput.focus();

    /**
     * Initialize Socket.io :) this is the secret sauce to the entire app!
     */
    var socket = io();

    socket.on("connect", function(){
        socket.emit("newUser", "New User");
    });

    socket.on("newUser", function(user) {
        messaging.newUser(user);
    });

    /**
     * When the form is submitted, We will want to show the users message on the screen :)
     */
    $("form").submit(function (event) {
        messaging.sendMessage(event);
    });

    /**
     * When a user clicks Enter on the textarea, Lets instead make that send the message.
     */
    messageInput.keydown(function(event) {
        if(event.keyCode == 13 && event.ctrlKey) {
            event.preventDefault();
            messageInput.val( messageInput.val() + "\n");
        } else if (event.keyCode == 13 && !event.shiftKey) {
            messaging.sendMessage(event);
        }
    });

    /**
     * The app will tell us when to update the view (Socket.io) and it will also give us the data to put there.
     */
    socket.on("updatechat", function (msg) {
        messaging.newMessage(msg);
    });

    /**
     * Whenever the user clicks on the app, we'll automatically focus on the message input
     *
     * NOTE- this is only for development purposes right now, will be removed later.
     */
    $("html").not(".messages").click(function (e) {
        messageInput.focus();
    });
});