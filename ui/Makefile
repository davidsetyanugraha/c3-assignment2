deps:
	yarn

build: deps
	yarn build

docker-ssh: 
	make -C docker docker-ssh
docker-run: 
	make -C docker docker-run
docker-build: build
	make -C docker docker-build

PHONY: build docker-ssh docker-run docker-build deps
