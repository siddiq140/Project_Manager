import jwt from "jsonwebtoken";

// Function to verify authenticated user
export const verifyUser = async (req, res, next) => {
   let token;

   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
   ) {
      token = req.headers.authorization.split(" ")[1];
   } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
   }

   if (!token) {
      return res
         .status(401)
         .json({ message: "No token, authorization denied" });
   }

   try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      next();
   } catch (err) {
      console.error("Token verification error:", err);

      if (err.name === "TokenExpiredError") {
         return res
            .status(403)
            .json({ message: "Token expired, authorization denied" });
      } else if (err.name === "JsonWebTokenError") {
         return res
            .status(403)
            .json({ message: "Invalid token, authorization denied" });
      }

      return res
         .status(403)
         .json({ message: "Token is invalid, authorization denied" });
   }
};

export default verifyUser;
