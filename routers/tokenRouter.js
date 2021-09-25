import express from "express";
const Router = express.Router();
import { getUserByEmailAndRefreshToken } from "../models/user-model/User.model.js";
import { verifyRefreshJWT, createAccessJWT } from "../helpers/jwt.helper.js";

Router.all("/", (req, res, next) => {
  console.log("token got hit");

  next();
});

Router.get("/", async (req, res) => {
  try {
    const { authorization } = req.headers;
    //1. check if the token is valid
    const { email } = verifyRefreshJWT(authorization);

    console.log(email);

    //2. get the user info
    if (email) {
      // get user id from db by email
      const filter = {
        email,
        refreshJWT: authorization,
      };
      const user = await getUserByEmailAndRefreshToken(filter);
      console.log(user);
      if (user?._id) {
        const accessJWT = await createAccessJWT({ _id: user._id, email });
        console.log(accessJWT);
        return res.json({
          accessJWT,
        });
      }
    }
    res.status(401).json({
      status: "error",
      message: "Unauthenticated",
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: "error",
      message: "Unauthenticated",
    });
  }
});

export default Router;
