import express from "express";
import passport from "passport";
import routes from "../routes";
import { home, search } from "../controllers/videoController";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
  githubLogin,
  postGithub,
  kakaoLogin,
  postKakao,
  getMe,
} from "../controllers/userController";

const globalRouter = express.Router();
// Home
globalRouter.get(routes.home, home);
// Join
globalRouter.get(routes.join, getJoin);
globalRouter.post(routes.join, postJoin, getLogin);
// Login
globalRouter.get(routes.login, getLogin);
globalRouter.post(routes.login, postLogin);
// Github Login
globalRouter.get(routes.github, githubLogin);
globalRouter.get(
  routes.githubCallback,
  passport.authenticate("github", {
    failureRedirect: routes.login,
  }),
  postGithub
);
// Kakao Login
globalRouter.get(routes.kakao, kakaoLogin);
globalRouter.get(
  routes.kakaoCallback,
  passport.authenticate("kakao", { failureRedirect: routes.login }),
  postKakao
);
// Logout
globalRouter.get(routes.logout, logout);
// Search
globalRouter.get(routes.search, search);
// Me
globalRouter.get(routes.me, getMe);

export default globalRouter;
