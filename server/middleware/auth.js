import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../const/constant";

export const auth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({message: "Missing token"});

    const token = header.split(" ")[1];
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({message: "Invalid token"});
    }
};

module.exports = auth;