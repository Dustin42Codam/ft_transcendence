docker-compose up --build &




# EXI_CODE = executeTests.sh
EXIT_CODE=0

docker kill $(docker ps -q)

exit $EXIT_CODE
