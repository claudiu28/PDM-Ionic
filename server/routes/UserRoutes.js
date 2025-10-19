import express from "express";

const service = require('../services/UserService');

const router = express.Router();
const userService = new service();

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message: 'Missing email or password'});
        }

        const user = userService.login(email, password);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error during login'});
    }
})