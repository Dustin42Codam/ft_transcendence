# start up the application as specific in subject
# here we use -d to put the docker containers in to the bg for testing purposes
docker-compose up --build -d

need_healthy_services=2
healthy_service_count=0
while [ true ]
do
	docker-compose ps
	healthy_service_count=$(docker-compose ps | grep "healthy" | wc -l)
	if [ $(docker-compose ps | grep "unhealthy" | wc -l) -gt 0 ]
	then
		docker-compose ps
		docker-compose down
		exit 1
	fi
	if [ $need_healthy_services -eq $healthy_service_count ]
	then
		break
	fi
	sleep 10
done

# Kill all containers to stop the CI process
docker-compose down

# Ecit with exit code from tests ran
exit $EXIT_CODE
