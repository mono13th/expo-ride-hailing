# Expo Ride Hailing Application

This is an incredibly simple "ride hailing application" built with Expo and Sockets. The app allows the passenger to search for a destination and request a ride followed by the driver accepting the ride and getting directions to the pick up location.

![passenger](https://user-images.githubusercontent.com/12575994/58374728-c3071d00-7f08-11e9-8cd8-c300764e3e65.png)

### Local Setup

1. Clone this repository with `git clone https://github.com/tsnolan23/expo-ride-hailing.git`
1. Change into the repo directory with `cd expo-ride-hailing`
1. Install dependencies with `yarn install`
1. Rename the `.env.example` file to `.env`
1. Specify values for the Google API key and the IP address\*
1. Start up the simple socket server with `yarn run start:server`
1. Start up the expo server with `yarn start`

> \* These values are required for the map searches and socket server to work with Expo running on your devices

### Drivers

Drivers can search for potential rides, view the route to get to the passenger, accept the ride, and then have navigation begin to pick them up.

1. Open the app using the Expo Client on your device
1. Select `Driver` from the main screen
1. Click `Find Passengers`
1. Once a passenger requests a ride, a route will be planned to pick them up
1. Accept the ride to start navigation

### Passengers

Passengers can search for a destination, see a route defined on a map, and see the driver's current location when the ride is accepted.

1. Open the app up using the Expo Client on your device
1. Select `Passenger` from the main screen
1. Search and select a destination
1. View the planned route on a map
1. Request a ride
1. Once the driver has accepted the ride, you will see the car icon appear
