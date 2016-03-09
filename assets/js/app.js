/**
 * Chat Application
 *
 * @Author - Jake Jarrett
 * @GitHub URL - https://github.com/jakejarrett/chat-example
 *
 */

$(function() {

    /** Focus the message input when we've loaded the page, So users can just start chatting! **/
    $('#message').focus();

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

    /** HTML Escape **/
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    /**
     * When the form is submitted, We will want to show the users message on the screen :)
     */
    $('form').submit(function (e) {
        /** Prevent the form from submitting **/
        e.preventDefault();

        /** Check if the input actually has stuff in it (EG/ not just a bunch of spaces) **/
        if (0 !== $("#message").val().trim().length) {
            /** Let the app know we want to send the message **/
            socket.emit('sendchat', $('#message').val());

            /** Clear the input **/
            $('#message').val('');
        }

        /** Always return false **/
        return false;
    });

    /**
     * The app will tell us when to update the view (Socket.io) and it will also give us the data to put there.
     */
    socket.on('updatechat', function (msg) {
        $('#messageContainer').append(htmlBeginning + escapeHtml(msg) + htmlEnding);
    });

    /**
     * Whenever the user clicks on the app, we'll automatically focus on the message input
     *
     * NOTE- this is only for development purposes right now, will be removed later.
     */
    $("html").on("click", function (e) {
        $('#message').focus();
    });

    /**
     * We don't want a user to run random scripts in the page, so lets escape all messages.
     *
     * @param string
     * @returns {string}
     */
    function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }
});