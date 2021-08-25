# Straight Up Chess

A  full-stack [chess application](https://straight-up-chess.herokuapp.com/) that allows the user to play chess online against other users.

![chess](https://user-images.githubusercontent.com/59109937/129427782-9ac22c73-5768-46bc-a821-a0f68ae551c9.gif)

## Motivation

Since I first learned how to code, I had a stronger grasp on how other developers could put together a game.  Writing the logic behind a game of chess seemed within reach, albeit a daunting task.  And after learning how to implement a Node.js server and PostgreSQL database, I could see how everything could come together for a full-stack project.  So I decided I would make a chess application for my first full-stack project.  Furthermore, it gave me the opportunity to expand my toolkit by learning Bootstrap and Socket.IO; Bootstrap in general since I've seen it talked about as a reliable library, and Socket.IO specifically to implement real-time communication between client and server.

## Technologies

#### Client Side

* Built using **React** for a dynamic front-end experience
* Delivered styling efficiently and responded to media breakpoints seamlessly through **Bootstrap**'s utility classes
* Communicated with the server via **Fetch** requests and **Socket.IO**'s client API.

#### Server Side

* Implemented server side using **Express** and **Socket.IO**
* Handled real-time, bidirectional communication between client and server via **Socket.IO** server API
* Managed user login authentication with **Argon2** and **JSON Web Tokens**

#### Database

* Used a PostgreSQL database to store users, games, and moves from each game

## Features

#### Current Features

1. User can open a multiplayer chess game
2. User can view a list of games to join
3. User can join a game
4. User can take their turn
5. User can win their game
6. User can forfeit their game
7. User can sign up
8. User can sign in
9. User can play chess on a single device

#### Pending Stretch Features

1. User can propose a rematch
2. User can view their match history
3. User can replay a past match


## Get Started

1. Download Node.js.
2. Clone the straight-up-chess repository.
3. Open the terminal to the straight-up-chess repository.
4. Run the command `npm install` to download the necessary npm packages.
5. Run the command `cp .env.example .env` to create a `.env` file for the application.
6. In the `.env` file, change the `TOKEN_SECRET` to a suitable value.
7. In the `.env` file, change the `DATABASE_URL` at `changeMe` to `straightUpChess`.
8. Run the command `sudo service postgresql status` to see if postgresql is running.
9. If postgresql is not running, run the command `sudo service postgresql start`.
10. Run the command `npm run db:import` to instantiate the database.
11. Run the command `npm run dev` to start the server and run the client as a live server.
12. View the client in the browser at `localport:3000`.
13. To view the database on pgweb, open another terminal and run the command `pgweb --db=<insert DATABASE_URL's changeMe from .env>`; then, open the browser to `localhost:8081`.

## Live

Check out my app [here](https://straight-up-chess.herokuapp.com/)!
