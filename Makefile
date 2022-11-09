SRC = docker-compose-dev.yml

all:
	docker-compose up --build

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

dev:
	docker-compose -f $(SRC) up

build:
	docker-compose -f $(SRC) up --build

clean:
	./docker-nuke.sh

re:
	make clean && make all

.PHONY: frontend backend pgAdmin4 postgres decrypt encrypt clean re
