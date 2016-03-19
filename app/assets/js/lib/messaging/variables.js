import $ from "jquery";

/** Setup Messaging variables **/
export const app = $(".app");
export const landingPage = $(".landing-page");
export const messageInput = $("#message");
export const messageContainer = $("#messageContainer");
export const usernameRegistrationForm = $("form#landing-page-form");
export const urlRegEx = /(\b(https?|ftp|file|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;