const express = require("express");

const projectRouter = require(`./routers/projects`);
const server = express();

server.get(`/`, (req, res) => res.send(`API Running`));
server.use(`/api/projects`, projectRouter);

module.exports = server;
