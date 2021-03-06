/* eslint no-undef: "error" */
/* eslint-env node */

// requires
const { database, secret, port } = require('./config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const passport = require('passport');
const path = require('path');

// mongodb database connection
mongoose.connect(database);

// middleware
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('morgan')('dev'));
app.set('view engine', 'ejs');

// passport.js authorization
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// settings
app.set('superSecret', secret);
app.use(require('express-session')({ secret: secret, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// static files
app.use('/js', express.static(path.resolve('views', 'assets', 'js')));
app.use('/css', express.static(path.resolve('views', 'assets', 'css')));
app.use('/mde', express.static(path.resolve('views', 'assets', 'simplemde', 'dist')));
// main routes
app.use('/notes', require('./routes/notes'));
app.use('/', require('./routes/primary'));

app.listen(port);
console.log(`${port} is the magic port! I hope.`);
