import jwt from "jsonwebtoken";

export const getUserId = token => {
  if (!token) return undefined;
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  return jwt.decode(token, { complete: true })?.payload?.userId;
};

export const validateJwt = async token => {
  if (!token) return Promise.reject(new Error("Token was not supplied"));

  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  return new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        const e = new Error("Token is not valid");
        e.code = "INVALID_TOKEN";

        reject(e);
      } else resolve(decoded);
    })
  );
};
