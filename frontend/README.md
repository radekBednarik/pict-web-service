# PICT web service frontend

Simple one-page web application written
in [Typescript](https://www.typescriptlang.org/)
and using [Vite](https://vitejs.dev/) for tooling.

## Preconditions

- have a standard browser, like Chrome, Firefox
- [Node.js](http://nodejs.org) LTS
- git

## Installation

- after cloning switch to the `./frontend` folder and run `npm install`
- create `.env` file with following key/value pairs:
  - `VITE_SERVER_BASE_URL=http://localhost:4000`

## Running the application on localhost

- open separate shell windows, switch to the `./frontend` folder
  and run `npm run dev`
- open the provided link in the shell in the browser
- profit

## Usage

- provide model specification for generating test cases, as specified in the [PICT](https://github.com/microsoft/pict/blob/main/doc/pict.md)
- example model is provided in `./tests/test-data` folder
- select output type of downloaded file
- after clicking the button, browser should prompt you
  for download of the file, or download automatically in you default Downloads folder

## Errors

- server errors do not contain any inner information for the security reasons
- frontend will display generic message below the form
- more detailed message can be found in the
  response body of the `./generate` request call in devtools
