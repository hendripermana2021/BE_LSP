import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = {
      userId: decoded.id,
      name_user: decoded.name_user,
      sex: decoded.sex,
      email: decoded.email, // Fix here: change decoded.gender to decoded.email
      role_id: decoded.role_id,
    };

    req.id = decoded.userId;
    req.name_user = decoded.name_user;
    req.sex = decoded.sex;
    req.email = decoded.email;
    req.role_id = decoded.role_id;

    next();
  });
};
