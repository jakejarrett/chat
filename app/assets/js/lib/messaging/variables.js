import $ from "jquery";

/** Setup Messaging variables **/
export const app = $(".app");
export const landingPage = $(".landing-page");
export const messageInput = $("#message");
export const messageContainer = $("#messageContainer");
export const usernameRegistrationForm = $("form#landing-page-form");
export const username = sessionStorage.user;
export const htmlBeginning = "<div class='row msg_container base_sent'><div class='col-md-10 col-xs-10'><div class='messages msg_sent'>";
export const htmlEnding = "</div></div></div>";