import passport from "passport";
import User from "../models/User";
import routes from "../routes";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const {
    user: currentUser,
    body: { name, email, password1, password2 },
  } = req;
  try {
    if (currentUser) {
      if (password1 !== password2) {
        res.status(400);
        res.redirect(routes.join);
        return;
      }
      await User.register(currentUser, password1);
      res.redirect(routes.me);
      return;
    }
    if (password1 !== password2) {
      res.status(400);
      res.redirect(routes.join);
      return;
    }
    const user = await User({
      name,
      email,
    });
    await User.register(user, password1);
    next();
  } catch (error) {
    console.log(error);
    res.redirect(res.home);
  }
};

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
});

export const githubLogin = passport.authenticate("github");

export const githubLoginCallback = async (req, _, __, profile, cb) => {
  const {
    _json: { id: githubId, name, email, avatar_url: avatarUrl },
  } = profile;
  const { user: currentUser } = req;
  const existingUser = await User.findOne({ githubId });
  try {
    if (currentUser && !currentUser.githubId) {
      currentUser.githubId = githubId;
      currentUser.save();
      return cb(null, currentUser);
    }
    if (existingUser) {
      return cb(null, existingUser);
    }
    const newUser = await User.create({
      name,
      email,
      avatarUrl,
      githubId,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithub = (req, res) => res.redirect(routes.home);

export const kakaoLogin = passport.authenticate("kakao");

export const kakaoLoginCallback = async (req, _, __, profile, done) => {
  const {
    _json: {
      id: kakaoId,
      kakao_account: {
        email,
        profile: { nickname: name, profile_image_url: avatarUrl },
      },
    },
  } = profile;
  const { user: currentUser } = req;
  const existingUser = await User.findOne({ kakaoId });
  try {
    if (currentUser && !currentUser.kakaoId) {
      currentUser.kakaoId = kakaoId;
      currentUser.save();
      return done(null, currentUser);
    }
    if (existingUser) {
      return done(null, existingUser);
    }
    const newUser = await User.create({
      name,
      email,
      avatarUrl,
      kakaoId,
    });
    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
};

export const postKakao = (_, res) => res.redirect(routes.home);

export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

export const getMe = (req, res) =>
  res.render("userDetail", { pageTitle: "Me", user: req.user });

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id);
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) => {
  res.render("editProfile", { pageTitle: "Edit Profile" });
};

export const postEditProfile = async (req, res) => {
  const {
    file,
    user,
    body: { name, email },
    user: { id },
  } = req;
  try {
    await User.findOneAndUpdate(id, {
      name,
      email,
      avatarUrl: file ? file.path : user.avatarUrl,
    });
    res.redirect(routes.me);
  } catch (error) {
    res.redirect(`/user${routes.editProfile}`);
  }
};

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    user,
    body: { oldPassword, newPassword1, newPassword2 },
  } = req;
  try {
    if (newPassword1 !== newPassword2) {
      res.status(400);
      res.redirect(`/user${routes.changePassword}`);
      return;
    }
    await user.changePassword(oldPassword, newPassword1);
    res.redirect(routes.me);
  } catch (error) {
    res.status(400);
    res.redirect(`/user${routes.changePassword}`);
  }
};
