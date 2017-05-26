'use strict';

const express = require('express');
const router = express.Router();
const morgan = require('morgan');

const blogPostsRouter = require('./blogPostsRouter.js');
const {BlogPosts} = require('./models');

const app = express();

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

BlogPosts.create('Raining today', 'Today it is raining; I just saw a water spout. Yikes!' , 'Chris');
BlogPosts.create('Sunny today', '95 degrees and sunny here', 'Kyle R');
BlogPosts.create('Expecting rain', 'Maybe that rain from FL will hit here. Not sure yet.', 'William');



// when requests come into `/blog-posts` or
// we'll route them to the express
// router instances we've imported. Remember,
// these router instances act as modular, mini-express apps.
app.use('/blog-posts', blogPostsRouter);


// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
// });

// both runServer and closeServer need to access the same
// server object, so we declare `server` here, and then when
// runServer runs, it assigns a value.
let server;

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};


