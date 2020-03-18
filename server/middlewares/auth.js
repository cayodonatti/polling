import responses from "../status";
import { validateJwt } from "../helpers";

export const authMiddleware = async (req, res, next) => {
  const token =
    req.headers["x-access-token"] ?? req.headers["authorization"] ?? "";

  if (token) {
    try {
      await validateJwt(token);
      return next();
    } catch (e) {
      return responses.error(res, e, 401);
    }
  } else {
    return responses.error(
      res,
      {
        message: "Auth token is not supplied and this is a private endpoint",
        code: "TOKEN_EXPIRED"
      },
      401
    );
  }
};
