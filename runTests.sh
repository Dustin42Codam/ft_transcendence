# start up the application as specific in subject
docker-compose up --build &>/dev/null &


# give server time to start-up
sleep 25


# EXIT_CODE = executeTests.sh
EXIT_CODE=0

# Kill all containers to stop the CI process
docker kill $(docker ps -q)


# Ecit with exit code from tests ran
exit $EXIT_CODE
