#!/bin/bash
# start up the application as specific in subject

docker-compose up --build &>/dev/null &


sleep 15

# EXIT_CODE = executeTests.sh
EXIT_CODE=0

./acceptanceTests.sh
EXIT_CODE+=$?

# Kill all containers to stop the CI process
docker kill $(docker ps -q)


# Ecit with exit code from tests ran
exit $EXIT_CODE
