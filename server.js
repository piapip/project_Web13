const express = require('express');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const server = express();

const config = require('./config-local.json');
const apiRouter = require('./routers/apiRouter');

server.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST", "GET", "PUT", "DELETE", "OPTIONS"
    );

    const acceptedOrigin = ["http://localhost:3000", "http://localhost:8080"];
    if (req.header.origin && acceptedOrigin.includes(res.header.origin)) {
        res.setHeader("Access-Control-Allow-Origin", req.header.origin);
    }

    res.setHeader("Access-Control-Allow-Credentials", true);

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, X-Request-With, Content-type, Accept"
    )
    next();
});

server.use(
    session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: config.secureCookie,
            maxAge: 60 * 60 * 24 * 1000
        }
    })
)

server.use(bodyParse.urlencoded({ extended: false }));
server.use(bodyParse.json());

server.use("/api", apiRouter);

server.get("/", (req, res) => {
    res.status(404).send("Idiot");
})

mongoose.connect(config.mongoPath, (err) => {
    if (err) console.error(err)
    else console.log("DB connect successfully!");
});

const port = 8080;
server.listen(port, (err) => {
    if (err) console.log(err)
    else console.log(`Server is listening at ${port}`);
});
