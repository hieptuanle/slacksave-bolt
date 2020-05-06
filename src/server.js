import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectRedis from "connect-redis";
import session from "express-session";
import passport from "passport";
import helmet from "helmet";
import { createClient } from "redis";
import { DBClient } from "./db";

import { init as initPassport } from "./passport";

export class Server {
  /**
   *
   * @param {DbClient} db
   */
  constructor(db) {
    this.db = db;
    this.app = express();
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    this.app.use(bodyParser.json({ limit: "2mb" }));
    this.app.use(cookieParser());

    const RedisStore = connectRedis(session);
    this.redisClient = createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });

    this.sessionStore = new RedisStore({ client: this.redisClient });

    this.app.use(
      session({
        saveUninitialized: true,
        resave: true,
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 2592000000 },
        store: this.sessionStore,
      })
    );

    initPassport(db);

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    this.app.use(helmet());

    this.app.route("/").get((req, res) => {
      if (req.user) {
        res.send(`Hello ${req.user.displayName}!`);
      } else {
        res.send("Hello World!");
      }
    });

    // path to start the OAuth flow
    this.app.get("/auth/slack", passport.authenticate("slack"));

    this.app.get("/signout", (req, res) => {
      req.logOut();
      res.redirect("/");
    });

    // OAuth callback url
    this.app.get(
      "/auth/slack/callback",
      passport.authenticate("slack", { failureRedirect: "/login" }),
      (req, res) => res.redirect("/")
    );
  }
}
