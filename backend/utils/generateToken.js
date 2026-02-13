import jwt from "jsonwebtoken";

const generateToken = (id, role ,isAdmin) => {
  return jwt.sign({ id, role, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;
