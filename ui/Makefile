deps:
	yarn

build: deps create-symbolic-link
	yarn build

create-symbolic-link:
	rm $(pwd)/ui/public/LGA_GeoData.json $(pwd)/ui/public/stat_area.json $(pwd)/ui/public/agg_favorite_cat.json
	ln -s $(dirname $(pwd))/geojson-files/LGA_GeoData.json $(pwd)/ui/public/LGA_GeoData.json
	ln -s $(dirname $(pwd))/analysis/output/stat_area.json $(pwd)/ui/public/stat_area.json
	ln -s $(dirname $(pwd))/analysis/output/agg_favorite_cat.json $(pwd)/ui/public/agg_favorite_cat.json

docker-ssh: 
	make -C docker docker-ssh
docker-run: 
	make -C docker docker-run
docker-build: build
	make -C docker docker-build

PHONY: build docker-ssh docker-run docker-build deps
