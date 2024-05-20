# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.12.2
ARG PICT_LOC
ARG PORT
ARG LOG_ENABLED
ARG LOG_FILE_PATH

FROM node:${NODE_VERSION}-alpine

RUN apk update && apk add curl alpine-sdk 

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/pwtg


# Copy the rest of the source files into the image.
COPY ./backend/binaries/pict  ./binaries/pict
COPY ./backend/src ./src
COPY ./backend/package.json ./package.json
COPY ./backend/package-lock.json ./package-lock.json
COPY ./backend/tsconfig.json ./tsconfig.json

RUN npm ci && npm run build
# Expose the port that the application listens on.
EXPOSE ${PORT} 

# Run the application as a non-root user.
RUN chown -R node:node /usr/src/pwtg && \
  chmod -R u+w /usr/src/pwtg

USER node

# Run the application.
CMD ["node", "./dist/index.js"]
