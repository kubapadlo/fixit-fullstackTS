import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Brak tokena" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid access token" });
    }

    // Zapisz dane użytkownika do req.user, żeby inne middleware miały dostęp
    req.user = decoded;
    next();
  });
};
