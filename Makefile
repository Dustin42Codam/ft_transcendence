SRC = docker-compose-dev.yml

all:
	docker-compose up --build

dep:
	@if [ $(shell node -v) = "v18.12.1" ]; then \
		echo "\e[32mnode version good\e[0m"; \
	else \
		echo "\e[31mnode version not good\e[0m Have:" $(shell node -v) "wanted $(LTS)\n\e[33;5mTO FIX use:\e[0m nvm install --lts; nvm use --lts; nvm alias default 18.12.1"; \
		:%; \
	fi;

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

re: dep
	make clean && make all

.PHONY: frontend backend pgAdmin4 postgres decrypt encrypt clean re
