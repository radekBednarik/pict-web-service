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
  - `PICT_LOC=location/of/the/pict` binary, e.g. if it is located
    in `/backend/binaries/pict` and you are starting the server from
    the `./backend` folder, then the value must be `./binaries/pict`.
    **Binary is now provided. To ensure, that it will be cloned,
    install `git lfs` on your system, see [HERE](https://git-lfs.com/)**
  - `LOG_FILE_PATH=/var/log/pict-server/server.log` - this example
    value is also the `default` value, if this setting is not provided
    in the `.env` file. **Make sure, that user, which will run
    the application on the server (or localhost) has access
    and write rights to the folders and file!**
  - `LOG_FILE_LEVEL=warn` - this is also the `default` value,
    if this setting is not provided. Sets the minimum level
    which will be written to log file.
  - `LOG_CONSOLE_LEVEL=warn` - this is also the `default` value
    if this setting is not provided. Sets the minimum level
    which is print out to stdout in the console.
  - `LOG_ENABLED=true` - this is also the `default` value,
    if this settings is not provided. Enabled/disabled logging.
    However, http requests/responses will be still logged in the console.

## Running the server on localhost

- open separate shell window, switch to `./backend` and run `npm run dev`

## Running the server on production

- you can use dockerfile located in the root of the whole project.

## Errors

- no inner error messages are sent to the frontend

## Logging

There are two destination of logging data:

- `.log` file
- console

### Log configuration

This is done via key/value pairs in `.env` file, specifically:

- `LOG_FILE_PATH=/var/log/pict-server/server.log` - this example
  value is also the `default` value, if this setting is not provided
  in the `.env` file. **Make sure, that user, which will
  run the application on the server (or localhost)
  has access and write rights to the folders and file!**

- `LOG_FILE_LEVEL=warn` - this is also the `default` value,
  if this setting is not provided. Sets the minimum level
  which will be written to log file.
- `LOG_CONSOLE_LEVEL=warn` - this is also the `default` value if this
  setting is not provided.
  Sets the minimum level which is print out to stdout in the console.
- `LOG_ENABLED=true` - this is also the `default` value, it this
  setting is not provided. Enabled/disabled logging.
- recognized log levels are listed [HERE](https://getpino.io/#/docs/api?id=levels)
