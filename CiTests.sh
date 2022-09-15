#!/bin/bash

docker-compose up --build &>/dev/null &

max_iterations=10
wait_seconds=6
http_endpoint="0.0.0.0:8082"

iterations=0
while true
do
	((iterations++))
	echo "Attempt $iterations"
	docker ps
	sleep $wait_seconds

	http_code=$(curl --verbose -s -o /tmp/result.txt -w '%{http_code}' "$http_endpoint";)
# http code should be changed to 200
	if [ "$http_code" -eq 302 ]; then
		echo "Server Up"
		break
	fi

	if [ "$iterations" -ge "$max_iterations" ]; then
		echo "Loop Timeout"
		exit 1
	fi
done

EXIT_CODE=0

./acceptanceTests.sh
EXIT_CODE+=$?

# Kill all containers to stop the CI process
docker kill $(docker ps -q)


# Ecit with exit code from tests ran
exit $EXIT_CODE
