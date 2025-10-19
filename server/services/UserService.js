import {PrismaClient} from "../generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getUserByEmail(email) {
        return await this.prisma.findUnique({
            where: {email}
        });
    }

    async login(email, password) {
        const user = await this.getUserByEmail(email);
        if (!user) {
            throw new Error("User does not exist");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET, {expiresIn: '24h'});

        const userLogged = new User(user);
        delete userLogged.password;
        return {user: userLogged.toJSON(), token};
    }
}

module.exports = UserService;