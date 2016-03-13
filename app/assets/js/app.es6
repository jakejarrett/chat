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
import escapeHtml from "./lib/htmlEscape";
import notifyUser from "./lib/notifications";

$(function() {

    /** Setup App's variables **/
    const messageInput = $("#message");

    /** Focus the message input when we"ve loaded the page, So users can just start chatting! **/
    messageInput.focus();

    /**
     * Initialize Socket.io :) this is the secret sauce to the entire app!
     */
    var socket = io();

    /**
     * HTML strings for beginning and ending of each message
     * @type {string}
     */
    var htmlBeginning = "<div class='row msg_container base_sent'><div class='col-md-10 col-xs-10'><div class='messages msg_sent'>";
    var htmlEnding = "</div></div></div>";

    /**
     * When the form is submitted, We will want to show the users message on the screen :)
     */
    $("form").submit(function (e) {
       sendMessage(e);
    });

    /**
     * When a user clicks Enter on the textarea, Lets instead make that send the message.
     */
    messageInput.keydown(function(event){
        if(event.keyCode == 13 && event.ctrlKey) {
            event.preventDefault();
            messageInput.val( messageInput.val() + "\n");
        } else if (event.keyCode == 13 && !event.shiftKey) {
            sendMessage(event);
        }
    });

    /**
     * The app will tell us when to update the view (Socket.io) and it will also give us the data to put there.
     */
    socket.on("updatechat", function (msg) {
        $("#messageContainer").append(htmlBeginning + escapeHtml(msg).replace(/\n/g, "<br />") + htmlEnding);

        /** Scroll to the bottom of the chat ~ **/
        $("html, body").animate({ scrollTop: $(document).height() });

        notifyUser("New Message", {
            body: msg
        });
    });

    /**
     * Whenever the user clicks on the app, we'll automatically focus on the message input
     *
     * NOTE- this is only for development purposes right now, will be removed later.
     */
    $("html").on("click", function (e) {
        messageInput.focus();
    });

    /**
     * Send the message
     *
     * @param event
     * @returns {boolean}
     */
    var sendMessage = function(event) {
        /** Prevent the form from submitting **/
        event.preventDefault();

        /** Check if the input actually has stuff in it (EG/ not just a bunch of spaces) **/
        if (0 !== messageInput.val().trim().length) {
            console.log(messageInput.val())
            /** Let the app know we want to send the message **/
            socket.emit("sendchat", messageInput.val());

            /** Clear the input **/
            messageInput.val("");
        }

        /** Always return false **/
        return false;
    }
});