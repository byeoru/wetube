import passport from "passport";
import GithubStrategy from "passport-github";
import KakaoStrategy from "passport-kakao";
import User from "./models/User";
import routes from "./routes";
import {
  githubLoginCallback,
  kakaoLoginCallback,
} from "./controllers/userController";

passport.use(User.createStrategy());

const {
  env: { PORT, GH_ID, GH_SECRET, KA_ID, KA_SECRET },
} = process;

passport.use(
  new GithubStrategy(
    {
      clientID: GH_ID,
      clientSecret: GH_SECRET,
      callbackURL: `http://localhost:${PORT}${routes.githubCallback}`,
      passReqToCallback: true,
    },
    githubLoginCallback
  )
);

passport.use(
  new KakaoStrategy(
    {
      clientID: KA_ID,
      clientSecret: KA_SECRET,
      callbackURL: `http://localhost:${PORT}${routes.kakaoCallback}`,
      passReqToCallback: true,
    },
    kakaoLoginCallback
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
