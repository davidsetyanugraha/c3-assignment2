deps:
	yarn

build: deps create-symbolic-link	
	yarn build

create-symbolic-link:
	rm -f public/LGA_GeoData.json public/stat_area.json public/agg_favorite_cat.json
	ln -s $(dirname $(pwd))/geojson-files/LGA_GeoData.json $(pwd)/public/LGA_GeoData.json
	ln -s $(dirname $(pwd))/analysis/output/stat_area.json $(pwd)/public/stat_area.json
	ln -s $(dirname $(pwd))/analysis/output/agg_favorite_cat.json $(pwd)/public/agg_favorite_cat.json

docker-ssh: 
	make -C docker docker-ssh
docker-run: 
	make -C docker docker-run
docker-build: build
	make -C docker docker-build

PHONY: build docker-ssh docker-run docker-build deps
