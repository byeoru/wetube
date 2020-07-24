import multer from "multer";
import routes from "./routes";

const multerAvatar = multer({ dest: "uploads/avatars/" });
const multerVideo = multer({ dest: "uploads/videos/" });

export const uploadAvatar = multerAvatar.single("avatar");
export const uploadVideo = multerVideo.single("videoFile");

export const localsMiddleware = (req, res, next) => {
  res.locals.siteTitle = "WETUBE";
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
    return;
  }
  next();
};

export const onlyPrivate = (req, res, next) => {
  if (!req.user) {
    res.redirect(routes.home);
    return;
  }
  next();
};
