import express from "express";
import routes from "../routes";
import {
  getEditProfile,
  postEditProfile,
  getChangePassword,
  postChangePassword,
  userDetail,
} from "../controllers/userController";
import { uploadAvatar } from "../middlewares";

const userRouter = express.Router();
// Change Password
userRouter.get(routes.changePassword, getChangePassword);
userRouter.post(routes.changePassword, postChangePassword);
// Edit Profile
userRouter.get(routes.editProfile, getEditProfile);
userRouter.post(routes.editProfile, uploadAvatar, postEditProfile);
// User Detail
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;
