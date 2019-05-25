const express = require("express");
const app = express();
const port = 3000;
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

io.on("connection", socket => {
  console.log("a user connected :D");
  socket.on("rideRequest", routeDetails => {
    console.log(routeDetails);
  });
});

server.listen(port, () => console.log("Server running on port:" + port));
