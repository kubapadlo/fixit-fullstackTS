export const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({ message: "You are not allowed to enter this page" });
    }
    next();
  };
};
