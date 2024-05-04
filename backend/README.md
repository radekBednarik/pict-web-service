# PICT web service backend

Implements simple server running on [Express.js](https://expressjs.com/).

## Preconditions

- [Node.js](https://nodejs.org) LTS
- git

## Tested on

- Linux Ubuntu running as WSL on Windows 11

## Installation

- cd to `./backend` folder and run `npm install`
- create `.env` file and provide these key/value pairs:
  - `PORT=4000`
  - `PICT_LOC=location/of/the/pict` binary, e.g. if it is located in `/backend/binaries/pict` and you are starting the server from the `./backend` folder, then the value must be `./binaries/pict`

## Running the server on localhost

- open separate shell window, switch to `./backend` and run `npm run dev`

## Running the server on production

- `TBD`
