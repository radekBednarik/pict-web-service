FROM ubuntu:jammy AS base

ARG PICT_LOC
ARG PORT
ARG LOG_ENABLED
ARG LOG_FILE_PATH
ARG CI

ENV NODE_VERSION=20.16.0
ENV NVM_DIR=/root/.nvm
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y curl build-essential && apt-get clean
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash


RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

RUN node --version && npm --version

# add stuff 
WORKDIR /app/pwtg

COPY ./backend/binaries/pict  ./binaries/pict
RUN chmod +x ./binaries/pict

COPY ./backend/package.json ./package.json
COPY ./backend/src ./src
COPY ./backend/tsconfig.json ./tsconfig.json

# install packages and build
RUN npm install && npm run build

EXPOSE ${PORT}

CMD ["node", "./dist/index.js"]

