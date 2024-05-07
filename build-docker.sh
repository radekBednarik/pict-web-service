#!/bin/bash

DOCKER_BUILDKIT=1 docker build . --build-arg="PICT_LOC=./binaries/pict" --build-arg="PORT=4000" --build-arg="LOG_ENABLED=false" --build-arg="LOG_FILE_PATH=server.log" --tag=pict-service-backend
