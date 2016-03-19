/**
 * Messaging Module, Handles message events (EG/ New Message, Update Message, Delete Message & such)
 *
 * @param event
 * @returns {boolean}
 */
"use strict";

import $ from "jquery";
import {messageInput, messageContainer, urlRegEx} from "./variables";
import notifyUser from "../notifications";
import escapeHtml from "../htmlEscape";

/**
 * Give our functions access to socket!
 */
var socket = io();

/**
 * Gives the server the message & username and then clears the input value.
 *
 * @param event
 * @param username
 * @returns {boolean}
 */
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

/**
 * When the server broadcasts a new message, Lets check who sent it and style it appropriately.
 *
 * @param message
 * @param username
 */
export function newMessage(message, username) {
    /**
     * We want to detect if the message contains an @ sign
     * @type {number|Number}
     */
    var directMessage = message.indexOf("@");

    /**
     * We want to make it so we only have the username they targeted EG/ we don't want "@jake hey whats up", we want "jake" instead.
     * @type {string|String}
     */
    var targetUser = message.substring(directMessage+ 1).split(" ").slice(0, 1)[0];

    /** If you sent the message, Lets set the style as "sent" **/
    if(username === sessionStorage.user) {
        messageContainer.append("<div class='row msg_container base_sent'><div class='col-md-10 col-xs-10'><div class='messages msg_sent'><small>" + escapeHtml(username) + "</small><br />" +
            escapeHtml(message).replace(/\n/g, "<br />").replace(urlRegEx, "<a href='$1'>$1</a>") + "</div></div></div>");
    } else {
        /** If you received the message, Lets set the style as "received" **/
        messageContainer.append("<div class='row msg_container base_receive'><div class='col-md-10 col-xs-10'><div class='messages msg_receive'><small>" + escapeHtml(username) + "</small><br />" +
            escapeHtml(message).replace(/\n/g, "<br />").replace(urlRegEx, "<a href='$1'>$1</a>") + "</div></div></div>");
    }

    /** Scroll to the bottom of the chat ~ **/
    $("html, body").animate({ scrollTop: $(document).height() });

    /**
     * Only notify if someone directly includes you or @all (Not sure if i'll keep this in)
     */
    if(0 <=  directMessage && "all" === targetUser || sessionStorage.user === targetUser) {
        notifyUser("Message from" + username, {
            body: message
        });
    }
}

/**
 * Broadcast from the server that a user has joined the chat.
 *
 * @param author
 * @param user
 */
export function newUser(author, user) {
    messageContainer.append(`<div class="row msg_container base_new_user"><div class="col-md-8 col-xs-8"><div class="messages new_user"><small>${author}</small> <br /> ${user} has joined the chat
    </div></div></div>`);

    $("html, body").animate({ scrollTop: $(document).height() });
}

/**
 * Broadcast from the server that a user has left the chat.
 *
 * @param author
 * @param user
 */
export function userDisconnect(author, user) {
    messageContainer.append(`<div class="row msg_container base_new_user"><div class="col-md-8 col-xs-8"><div class="messages new_user"><small>${author}</small> <br /> ${user} has disconnected from
    the chat</div></div></div>`);

    $("html, body").animate({ scrollTop: $(document).height() });
}