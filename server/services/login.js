import { User, Poll } from "../schemas";
import responses from "../status";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const rounds = 10;

export const loginService = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const sessionId = req.headers.sessionid;

      const usernameValid =
        username && username.length >= 5 && username.length <= 23;
      const passwordValid =
        password && password.length >= 8 && password.length <= 23;
      const invalidate = () =>
        responses.error(res, new Error("Incorrect username or password"), 403);

      if (usernameValid && passwordValid) {
        let user = await User.findOne({ username }).exec();

        if (!user) {
          const encryptedPass = await bcrypt.hash(password, rounds);
          user = await User.create({ username, password: encryptedPass });
        } else {
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return invalidate();
          }
        }

        // Links all polls created with the same session to the current user.
        // Clear session identifier to prevent re-linking
        if (sessionId) {
          await Poll.updateMany(
            { sessionId },
            { $set: { userId: user._id, sessionId: null } }
          ).exec();
        }

        const token = jwt.sign(
          { username: user.username, userId: user._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d"
          }
        );

        return responses.success(res, {
          token,
          username: user.username,
          _id: user._id
        });
      } else {
        invalidate();
      }
    } catch (e) {
      return responses.error(res, e);
    }
  }
};
