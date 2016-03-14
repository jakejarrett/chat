# Chat
This is based on the code from socket.io's [chat-example](http://socket.io/get-started/chat/)

# Installing/Running the app
```bash
$ npm install -g browserify
$ npm install
$ browserify app/assets/js/app.es6 -o app/assets/js/app.js -t [ babelify --presets [ es2015 ] ]
$ node index.js
```

# Features
* Users can join chat with a unique name (Prevents users having duplicate names)
* Users can send/recieve global messages
* Notifications (Improvements coming to this too)
* ES6 :smile_cat:
