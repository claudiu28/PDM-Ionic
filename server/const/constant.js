require('dotenv').config();

const SERVER = process.env.SERVER;
const HOSTNAME = process.env.HOSTNAME;
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    SERVER,
    HOSTNAME,
    PORT,
    JWT_SECRET
}