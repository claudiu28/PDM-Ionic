require('dotenv').config();

const SERVER = process.env.SERVER;
const HOSTNAME = process.env.HOSTNAME;
const PORT = process.env.PORT;

module.exports = {
    SERVER,
    HOSTNAME,
    PORT,
}