const express = require("express");
const app = express();
const port = 3000;
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

let rideSocket = null;
let passengerSocket = null;

io.on("connection", socket => {
  // Handle when a passenger requests a ride
  socket.on("requestRide", ridePlaceIds => {
    passengerSocket = socket;
    console.log("passenger requested a ride");
    if (rideSocket) {
      rideSocket.emit("rideRequested", ridePlaceIds);
    }
  });

  // Handle when a driver is looking for a passenger
  socket.on("findPassengers", () => {
    console.log("look for rides");
    rideSocket = socket;
  });

  // Handle when a driver accepts a ride
  socket.on("rideAccepted", driverLocation => {
    console.log("ride accepted");
    passengerSocket.emit("driverLocationChange", driverLocation);
    passengerSocket.emit("driverFound", driverLocation);
  });
});

server.listen(port, () => console.log("Server running on port:" + port));
