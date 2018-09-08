const express = require('express');
const userRouter = express.Router();
const UserModel = require("../models/userModel");
const bcrypt = require('bcryptjs');

userRouter.get("/", (req, res) => {
    UserModel.find({}, (err, users) => {
        if (err) res.status(500).send({ success: 0, err })
        else res.status(201).send({ success: 1, users })
    })
});

userRouter.get("/:userID", (req, res) => {
    UserModel.findById({ _id: req.params.userID }, (err, userFound) => {
        if (err) res.status(500).send({ success: 0, err })
        else if (!userFound) res.status(401).send({ success: 0, message: "Not found!" })
        else res.status(201).send({ success: 1, userFound })
    })
});

userRouter.post("/", (req, res) => {
    const { name, email, sdt, password, gymJoin, chosenPT } = req.body;
    UserModel.create({ name, email, sdt, password, gymJoin, chosenPT }, (err, userCreated) => {
        if (err) res.status(500).send({ success: 0, err })
        else res.status(201).send({ success: 1, userCreated });
    })
});

userRouter.put("/:userID", (req, res) => {
    const { name, email, sdt, password, gymJoin, chosenPT } = req.body;
    const updateInfo = { name, email, sdt, password, gymJoin, chosenPT };
    UserModel.findById({ _id: req.params.userID }, (err, userFound) => {
        if (err) res.status(500).send({ success: 0, err })
        else if (!userFound) res.status(401).send({ success: 0, message: "Not found!" })
        else {
            for (let key in updateInfo) {
                if (key == 'password' && updateInfo[key]) {
                    if (!bcrypt.compareSync(password, userFound.password)) {
                        userFound.password = password;
                    }
                } else if (updateInfo[key] != undefined) {
                    userFound[key] = updateInfo[key];
                }
            }
            userFound.save((err) => {
                if (err) res.status(500).send({ success: 0, err })
                else res.send({ success: 1, userFound });
            })
        }
    })
});

userRouter.delete("/:userID", (req, res) => {
    UserModel.findByIdAndRemove({ _id: req.params.userID }, (err, userDeleted) => {
        if (err) res.status(500).send({ success: 0, err })
        else if (!userDeleted) res.status(401).send({ success: 0, message: "Not Found!" })
        else res.send({ success: 1, message: "Delete successfully!" })
    })
})

module.exports = userRouter;