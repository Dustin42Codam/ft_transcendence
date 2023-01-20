SRC = docker-compose-dev.yml

all:
	docker-compose up --build

dep:


frontend: dep
	docker-compose -f $(SRC) up --build frontend

backend: dep
	docker-compose -f $(SRC) up --build backend

pgAdmin4: dep
	docker-compose -f $(SRC) up --build pgAdmin4

postgres: dep
	docker-compose -f $(SRC) up --build postgres

decrypt: dep
	./decrypt.sh ./encrypted_env.gpg

encrypt: dep
	./encrypt.sh ./.env

dev: dep
	docker-compose -f $(SRC) up

build: dep
	docker-compose -f $(SRC) up --build

clean: dep
	./docker-nuke.sh
down:
	docker-compose -f $(SRC) down 
stop:
	docker-compose down 

re: dep
	make clean && make all

.PHONY: frontend backend pgAdmin4 postgres decrypt encrypt clean re
