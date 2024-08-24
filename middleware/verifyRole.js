export const isAdmin = (req, res, next) => {
  if (req.user.role_id != 1) {
    return res.status(401).json({
      message:
        "You are not authorized please Login with account superadmin/admin",
    });
    return;
  }
  next();
};
