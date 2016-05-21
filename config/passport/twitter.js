'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const TwitterStrategy = require('passport-twitter').Strategy;
const config = require('../../config');
const User = mongoose.model('User');

/**
 * Expose
 */

module.exports = new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL,
    includeEmail: true
  },
  function (accessToken, refreshToken, profile, done) {
    const options = {
      criteria: { "twitter_id": profile.id }
    };
    User.load(options, function (err, user) {
      if (err) return done(err);
      if (!user) {
        let user = new User({
          name: profile.displayName,
          username: profile.username,
          provider: 'twitter',
          twitter_id: profile.id,
          twitter: profile._json
        });
        user.save(function (err) {
          if (err) console.log(err);
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    })
  }
);