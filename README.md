# ft_transcendence
## If you need to have a frech vue/js install or nest/js install this is the repo

### Development

`docker-compose-dev.yaml` which will create a dev enviorment

```sh
docker-compose -f docker-compose-dev.yaml up
docker-compose -f docker-compose-dev.yaml up --build
```

how did I do this? Well in the frontend dir I craeted a new vue project
then I added 2 docker files in that folder.
This will always a new install
Hot refresh works

### How to add packages?

```sh
docker ps
#get the id of the target docker container
docker exec -it id /bin/sh
vue add typescript
exit
```

### Production

`docker-compose-dev.yaml` which will create a production enviorment

```sh
docker-compose -f docker-compose-prod.yaml up
docker-compose -f docker-compose-prod.yaml up --build
```

This on is for when we eval!
