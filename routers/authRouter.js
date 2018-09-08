const express = require('express');
const bcrypt = require('bcryptjs');
const authRouter = express.Router();
const UserModel = require('../models/userModel');

authRouter.post('/login', (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        res.status(400).send({ success: 0, message: "Redo pls" })
    } else {
        UserModel.findOne({ name })
            .then(UserFound => {
                if (!name) res.status(400).send({ success: 0, message: "Not found!" })
                else {
                    const compare = bcrypt.compareSync(password, UserFound.password);
                    if (compare) {
                        req.session.userInfo = { name: UserFound.name };
                        res.send({ success: 1, message: "Login" });
                    } else {
                        res.status(401).send({ success: 0, message: "Unauthorized" });
                    }
                }
            })
            .catch(error => res.status(500).send({ success: 0, error }));
    }
});

authRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) res.status(500).send({ success: 0, err })
        else res.send({ success: 1, message: "Logout" });
    })
});

module.exports = authRouter;