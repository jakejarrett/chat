/**
 * Chat Application
 *
 * @Author - Jake Jarrett
 * @GitHub URL - https://github.com/jakejarrett/chat
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
import {app, messageInput, messageContainer, usernameRegistrationForm, landingPage} from "./lib/messaging/variables"
import * as messaging from "./lib/messaging";

$(function() {
    /** Focus the message input when we"ve loaded the page, So users can just start chatting! **/
    messageInput.focus();

    /** We don't want unregistered users seeing the chat. So we will disable chat until they register **/
    if(!sessionStorage.user) {
        var registered = false;
    }

    /**
     * Initialize Socket.io :) this is the secret sauce to the entire app!
     */
    var socket = io();

    /**
     * When socket starts the initial connection, lets get the user to register.
     */
    socket.on("connect", function() {
        /**
         * Make sure they're registered (EG/ if their connection dropped etc)
         */
        if(!registered) {
            $("#username").focus();
        }

        /**
         * When the user submits the form (Presses submit / Presses enter)
         */
        usernameRegistrationForm.submit(function(event){
            /** Because we use this selector more than once, lets set it as a variable **/
            let username = $("#username").val().trim();

            /** It would be silly to let someone use spaces as their name. **/
            if(0 !== username) {
                /** Prevent the form from submitting **/
                event.preventDefault();
                /** Notify the chat that there is a new user **/
                socket.emit("newUser", username);

                /** Store Username in session **/
                sessionStorage.user = username;
                registered = true;

                /** Show the App for the new user! **/
                landingPage.remove();
                app.show();
            }
        });
    });

    /**
     * When a new user joins, lets check if you're registered & if so, Then notify you a new user has joined the chat.
     */
    socket.on("newUser", function(author, user) {
        if(registered) {
            messaging.newUser(author, user);
        }
    });

    /**
     * When a user leaves, lets check if you're registered & if so, Then notify you a user has left the chat.
     */
    socket.on("userDisconnect", function(author, user) {
        if(registered) {
            messaging.userDisconnect(author, user);
        }
    });

    /**
     * When the form is submitted, We will want to show the users message on the screen :)
     */
    $("form#submit-message").submit(function (event) {
        let username = sessionStorage.user;
        messaging.sendMessage(event, username);
    });

    /**
     * When a user clicks Enter on the textarea, Lets instead make that send the message.
     */
    messageInput.keydown(function(event) {
        if(event.keyCode == 13 && event.ctrlKey) {
            event.preventDefault();
            messageInput.val( messageInput.val() + "\n");
        } else if (event.keyCode == 13 && !event.shiftKey) {
            let username = sessionStorage.user;
            messaging.sendMessage(event, username);
        }
    });

    /**
     * The app will tell us when to update the view (Socket.io) and it will also give us the data to put there.
     */
    socket.on("updatechat", function (msg, username) {
        if(registered) {
            messaging.newMessage(msg, username);
        }
    });

    /**
     * Whenever the user clicks on the app, we'll automatically focus on the message input
     *
     * NOTE- this is only for development purposes right now, will be removed later.
     */
    $("html").not(".messages").click(function (e) {
        if(registered) {
            messageInput.focus();
        } else {
            $("#username").focus();
        }
    });
});