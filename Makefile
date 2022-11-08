SRC = ./docker-compose-dev.yaml

all:
	docker-compose -f $(SRC) up

react_guide:
	docker-compose -f $(SRC) up --build react_guide

frontend:
	docker-compose -f $(SRC) up --build frontend

backend:
	docker-compose -f $(SRC) up --build backend

pgAdmin4:
	docker-compose -f $(SRC) up --build pgAdmin4

postgres:
	docker-compose -f $(SRC) up --build postgres

decrypt:
	./decrypt.sh ./encrypted_env.gpg

encrypt:
	./encrypt.sh ./.env

clean:
	./docker-nuke.sh

re:
	make clean && make all

.PHONY: frontend backend pgAdmin4 postgres decrypt encrypt clean re
