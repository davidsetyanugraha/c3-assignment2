# Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
# Team Name: Team 14
# Team Members:
#   Dading Zainal Gusti (1001261)
#   David Setyanugraha (867585)
#   Ghawady Ehmaid (983899)
#   Indah Permatasari (929578)
#   Try Ajitiono (990633)

deps:
	yarn

build: deps create-symbolic-link	
	yarn build

create-symbolic-link:
	rm -f public/LGA_GeoData.json public/stat_area.json public/agg_favorite_cat.json
	ln -s $(shell dirname $(shell pwd))/geojson-files/LGA_GeoData.json $(shell pwd)/public/LGA_GeoData.json
	ln -s $(shell dirname $(shell pwd))/analysis/background_process/output/stat_area.json $(shell pwd)/public/stat_area.json
	ln -s $(shell dirname $(shell pwd))/analysis/background_process/output/agg_favorite_cat.json $(shell pwd)/public/agg_favorite_cat.json

docker-ssh: 
	make -C docker docker-ssh
docker-run: 
	make -C docker docker-run
docker-build: build
	make -C docker docker-build

PHONY: build docker-ssh docker-run docker-build deps
