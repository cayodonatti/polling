# Cayo's simple polling

This was Cayo's (me) test on a polling website.

## Required setup

You need to have installed yarn. Everything else is dev dependency and the project should work out of the box. You also need a local MongoDB server running (see https://zellwk.com/blog/local-mongodb/).

You also need to setup a .env file as below:

```
API_PORT=21272
NODE_ENV=dev
JWT_SECRET=YOUR_JWT_SECRET
MONGO_SERVER=YOUR_MONGO_SERVER
MONGO_USER=YOUR_MONGO_USER
MONGO_PASS=YOUR_MONGO_PASSWORD
```

## Build

To install project packages:

```
yarn && cd client && yarn
```

To run the server + client on your machine on debug:

```
yarn debug
```

To run on production mode:

```
yarn build && yarn start
```

## How is it built?

This project consists of a node backend connected to a MongoDB remote and a React client.

### Server

I used nodejs with babel as a transpiler, so I can use nice es8 things (like async/await) and coalesce/nullish check operators. This increases code readbility and makes maintenance a lot easier. I used express as a framework to serve routes and setup listening, and also to serve static React built files. With it, I used body-parser to parse received requests to JSON and content-filter to handle some pesky NoSQL injections.

I used JWT as a security layer and bcrypt for password encryption. To connect to MongoDB, I used mongoose. MongoDB was choosen for no specific reason other than that I wanted to learn it's basics (I had no prior experience with it).

One desing decision is that I always get userId from the JWT token payload. This locks user access to content belonging to it.

### Client

Since I'm a React-Native developer, I decided to go with React for the client side. With it, comes redux as a state management tool. Althought redux isn't really needed here, I decided to go with it because I'm already familiar with it. I also went with redux-persist for data storage and react-redux for easier component connection to store. I used react-router as a route management tool and axios as an api client. Both make it easier to setup routing and request interceptors, respectively.

On the UI side, I've used mainly Material UI and recharts because I'm not too familiar with React Web and these were the first libs I found. Since I come from React-Native, I build most things using flexbox instead of grid.

## Things that could have been done better

- Use 'helmet' to protect http headers
- Use 'compression' to shrink server responses
- Use 'styled components' to define scoped styles and make CSS clearer
- Better structiring for api folders and methods
- Components should be dumber amd more specialized
- Build model validation on mongoose Schemas rather than controllers
