const express = require("express");
const app = express();
const port = 3000;
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

let rideSocket = null;

io.on("connection", socket => {
  socket.on("requestRide", ridePlaceIds => {
    console.log("passenger requested a ride");
    if (rideSocket) {
      rideSocket.emit("rideRequested", ridePlaceIds);
    }
  });
  socket.on("findPassengers", () => {
    console.log("look for rides");
    rideSocket = socket;
  });
});

server.listen(port, () => console.log("Server running on port:" + port));
