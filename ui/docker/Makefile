docker-ssh: 
	docker exec -it optimistic_mcnulty /bin/bash
docker-run: 
	docker run -p 5000 -it exampleapp:latest /bin/bash
docker-build:
	cp -r ../build .
	docker build --no-cache -f Dockerfile -t exampleapp:latest .

PHONY: docker-ssh docker-run docker-build
