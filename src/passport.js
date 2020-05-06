import passport from "passport";
import SlackStrategy from "./slack-strategy.passport";
import { DBClient } from "./db";

/**
 *
 * @param {DBClient} db
 */
export function init(db) {
  passport.serializeUser(function (user, done) {
    console.log(user);
    done(null, user.slackId);
  });

  passport.deserializeUser(function (id, done) {
    db.collection("users")
      .findOne({ slackId: id })
      .then((user) => {
        if (!user) {
          return done(new Error(`Cannot find user with id ${id}`));
        }
        done(null, user);
      })
      .catch((err) => {
        done(err);
      });
  });

  passport.use(
    new SlackStrategy(
      {
        clientID: process.env.SLACK_APP_ID,
        clientSecret: process.env.SLACK_APP_SECRET,
        callbackURL: process.env.SLACK_CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        const user = {
          ...profile,
          slackId: profile.id,
          accessToken,
          refreshToken,
        };
        db.collection("users")
          .updateOne(
            {
              slackId: profile.id,
            },
            {
              $set: user,
            },
            { upsert: true }
          )
          .then(() => {
            done(null, user);
          })
          .catch((err) => {
            done(err);
          });
      }
    )
  );
}
