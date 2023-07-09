const session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);

var store = new MongoDBStore({
  uri: process.env.DATABASE_URI,
  collection: "sessions",
});

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

const sess = {
  name: "scissors",
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: {
    name: "scissors",
    maxAge: +process.env.COOKIE_EXPIRES_IN,
  },
};

if (process.env.NODE_ENV === "production") {
  sess.cookie.domain = ".scissors-s7o9.onrender.com";
  sess.cookie.secure = true; // serve secure cookies
  sess.cookie.httpOnly = true; // serve secure cookies
}

module.exports = session(sess);
