import { verifyAccessJWT } from "../helpers/jwt.helper.js";
import { getSession } from "../models/session/Session.model.js";

export const isAdminUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      //validate the accessJWT
      const { email } = verifyAccessJWT(authorization);
      const session = email ? await getSession({ token: authorization }) : null;

      if (session?._id) {
        req.userId = session.userId;

        next();
        return;
      }
    }
    return res.status(403).json({
      status: "error",
      message: "Unauthorized",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error.",
    });
  }
};
