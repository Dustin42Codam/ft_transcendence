#!/usr/bin/env bash

echo 'WARNING! This will remove all docker containers, images, volumes and networks.'
echo 'Are you sure you want to continue? [y/N]'

read INPUT

if [ $INPUT == 'y' ]; then
	docker rm -f -v $(docker ps -aq) 2> /dev/null
	docker rmi -f  $(docker images -q) 2> /dev/null
	docker volume rm $(docker volume ls -q) 2> /dev/null
	docker network rm $(docker network ls -q) 2> /dev/null
else
	exit 1
fi

exit 0
