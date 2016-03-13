/**
 * Messaging Module, Handles message events (EG/ New Message, Update Message, Delete Message & such)
 *
 * @param event
 * @returns {boolean}
 */
"use strict";

import $ from "jquery";
import {messageInput, messageContainer, username, htmlBeginning, htmlEnding} from "./variables";
import notifyUser from "../notifications";
import escapeHtml from "../htmlEscape";

/**
 * Give our functions access to socket!
 */
var socket = io();

export function sendMessage(event) {
    /** Prevent the form from submitting **/
    event.preventDefault();

    /** Check if the input actually has stuff in it (EG/ not just a bunch of spaces) **/
    if (0 !== messageInput.val().trim().length) {

        /** Let the app know we want to send the message **/
        socket.emit("sendchat", messageInput.val(), username);

        /** Clear the input **/
        messageInput.val("");
    }

    /** Always return false **/
    return false;
}

export function newMessage(username, message) {
    messageContainer.append(htmlBeginning + "<small>" + escapeHtml(username) + "</small><br />" + escapeHtml(message).replace(/\n/g, "<br />") + htmlEnding);

    /** Scroll to the bottom of the chat ~ **/
    $("html, body").animate({ scrollTop: $(document).height() });

    notifyUser("Message from" + username, {
        body: message
    });
}

export function newUser(user) {
    messageContainer.append(`<div class='row msg_container base_new_user'><div class='col-md-6 col-xs-6'><div class='messages new_user'>${user} has joined the chat</div></div></div>`);
    $("html, body").animate({ scrollTop: $(document).height() });
}