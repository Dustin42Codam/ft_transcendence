#!/bin/bash
# start up the application as specific in subject

docker-compose up --build &>/dev/null &

max_iterations=10
wait_seconds=6
http_endpoint="http://localhost:8082/"

iterations=0
while true
do
	((iterations++))
	echo "Attempt $iterations"
	sleep $wait_seconds

	http_code=$(curl --verbose -s -o /tmp/result.txt -w '%{http_code}' "$http_endpoint";)

	if [ "$http_code" -eq 302 ]; then
		echo "Server Up"
		break
	fi

	if [ "$iterations" -ge "$max_iterations" ]; then
		echo "Loop Timeout"
		exit 1
	fi
done

# sleep 30

# EXIT_CODE = executeTests.sh
EXIT_CODE=0

./acceptanceTests.sh
EXIT_CODE+=$?

# Kill all containers to stop the CI process
docker kill $(docker ps -q)


# Ecit with exit code from tests ran
exit $EXIT_CODE
