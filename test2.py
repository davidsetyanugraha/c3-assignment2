import os, json
from shapely.geometry import Polygon
from shapely.geometry import Point

# pip install shapely
# OR
# pip install shapely[vectorized] for more speed; numpy required

class VicArea:
    def __init__(self, geojson):
        self.geojson = geojson
        self.teritories = {}
        self.centers = {}
        self.area_names = {}
        
        with open(self.geojson, encoding="utf8") as jsonfile:
            raw_grid = json.load(jsonfile)
            for teritory in raw_grid["features"]:
                polygon = Polygon(teritory["geometry"]["coordinates"][0][0])
                # k = teritory["properties"]["vic_lga__2"]
                k = teritory["properties"]["lga_pid"]
                if k not in self.teritories:
                    self.teritories[k] = []
                self.teritories[k].append(polygon)
                self.area_names[k] = teritory["properties"]["vic_lga__2"]
        
        for t in self.teritories:
            if len(self.teritories[t]) > 1:
                self.teritories[t].sort(key=lambda x:x.area, reverse=True)
            self.centers[t] = self.teritories[t][0].centroid
    
    def tag(self, x, y):
        # returns empty string if location is outside the whole grids
        # returns area label in LGA PID format
        test_point = Point(x, y)
        tag = ""
        for ter in self.teritories:
            for t in self.teritories[ter]:
                if test_point.within(t):
                    return ter
        return tag
    
    def name(self, tag):
        try:
            return self.area_names[tag]
        except KeyError:
            return "NON-VICTORIA"

filename = os.path.join(os.path.dirname(os.path.realpath(__file__)), "melbourne_territory.json")
victoria = VicArea(filename)

test1 = victoria.tag(144.0573356, -37.379531)
print(test1, victoria.name(test1))

test2 = victoria.tag(100, 100)
print(test2, victoria.name(test2))