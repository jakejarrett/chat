/**
 * Messaging Module, Handles message events (EG/ New Message, Update Message, Delete Message & such)
 *
 * @param event
 * @returns {boolean}
 */
"use strict";

import $ from "jquery";
import {messageInput, messageContainer, htmlBeginning, htmlEnding} from "./variables";
import notifyUser from "../notifications";
import escapeHtml from "../htmlEscape";

/**
 * Give our functions access to socket!
 */
var socket = io();

export function sendMessage(event, username) {
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

export function newMessage(message, username) {
    if(username === sessionStorage.user) {
        messageContainer.append("<div class='row msg_container base_sent'><div class='col-md-10 col-xs-10'><div class='messages msg_sent'><small>" + escapeHtml(username) + "</small><br />" + escapeHtml(message).replace(/\n/g, "<br />") + "</div></div></div>");
    } else {
        messageContainer.append("<div class='row msg_container base_receive'><div class='col-md-10 col-xs-10'><div class='messages msg_receive'><small>" + escapeHtml(username) + "</small><br />" + escapeHtml(message).replace(/\n/g, "<br />") + "</div></div></div>");
    }

    /** Scroll to the bottom of the chat ~ **/
    $("html, body").animate({ scrollTop: $(document).height() });

    notifyUser("Message from" + username, {
        body: message
    });
}

export function newUser(author, user) {
    messageContainer.append(`<div class="row msg_container base_new_user"><div class="col-md-6 col-xs-6"><div class="messages new_user"><small>${author}</small> <br /> ${user} has joined the chat</div></div></div>`);
    $("html, body").animate({ scrollTop: $(document).height() });
}

export function userDisconnect(author, user) {
    messageContainer.append(`<div class="row msg_container base_new_user"><div class="col-md-6 col-xs-6"><div class="messages new_user"><small>${author}</small> <br /> ${user} has disconnect from the chat</div></div></div>`);
    $("html, body").animate({ scrollTop: $(document).height() });
}