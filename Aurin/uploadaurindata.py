# Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
# Team Name: Team 14
# Team Members:
#   Dading Zainal Gusti (1001261)
#   David Setyanugraha (867585)
#   Ghawady Ehmaid (983899)
#   Indah Permatasari (929578)
#   Try Ajitiono (990633)

import json
import string
import couchdb



# Database Configuration
COUCH_IP = '172.26.38.57'
#BASE_URL = 'http://172.26.38.57:5984' #to be dynamically set
USERNAME = 'admin'
PASSWORD = 'password'
#couch = couchdb.Server(BASE_URL)
couch = couchdb.Server("http://%s:%s@%s:5984/" % (USERNAME, PASSWORD, COUCH_IP))

dbname = 'lga_vic_crime_stats_2008_2017'



filebasepath = "/Volumes/GoogleDrive/My Drive/UniMelb/Semester_1_2019/COMP90024_CCC/Assignment/Assignment2/Aurin/dataset/"

filepath = []
dbname = []


filepath.append("LGA_Censusbased_T02_Selected_Medians_and_Averages_2001/data1405525802468816482.json")
dbname.append("lga_censusbased_t02_selected_medians_and_averages_2001")
filepath.append("LGA_Censusbased_T02_Selected_Medians_and_Averages_2006/data9024787102397617716.json")
dbname.append("lga_censusbased_t02_selected_medians_and_averages_2006")
filepath.append("LGA_Censusbased_T02_Selected_Medians_and_Averages_2011/data183528473247888358.json")
dbname.append("lga_censusbased_t02_selected_medians_and_averages_2011")
filepath.append("LGA_PHIDU_Mothers_and_Babies_2012-2015/data4793167577171765148.json")
dbname.append("lga_phidu_mothers_and_babies_2012-2015")


filepath.append("LGA_Economic_Fundamentals_Indicators_2011/data8564021653491090488.json")
dbname.append("lga_economic_fundamentals_indicators_2011")
filepath.append("LGA_Estimating_Homelessness_2016/data4272239237552896856.json")
dbname.append("lga_estimating_homelessness_2016")
filepath.append("LGA_Number_of_Offences_in_Victoria_by_Offence_Type_2008_-_2017-3/data2441613285432591692.json")
dbname.append("lga_number_of_offences_in_victoria_by_offence_type_2008_-_2017-3")
filepath.append("LGA15_Adults_Health_Risk_Factor_Estimates_-_2014-2015/data6641723616966161584.json")
dbname.append("lga15_adults_health_risk_factor_estimates_-_2014-2015")
filepath.append("LGA_Sedentary_behaviour_sitting_hours_per_day/data651950195530344969.json")
dbname.append("lga_sedentary_behaviour_sitting_hours_per_day")
filepath.append("LGA_PHIDU_Housing_and_Transport_2016/data705602789685087773.json")
dbname.append("lga_phidu_housing_and_transport_2016")
filepath.append("LGA_profiles_data_2011/data4411990047338157835.json")
dbname.append("lga_profiles_data_2011")
filepath.append("LGA_profiles_data_2015/data1655499896240710566.json")
dbname.append("lga_profiles_data_2015")
filepath.append("LGA_profiles_data_2011/data4411990047338157835.json")
dbname.append("lga_profiles_data_2011")
filepath.append("LGA_Number_of_Offences_in_Victoria_by_Offence_Type_2008_-_2017/data6044373292158139311.json")
dbname.append("lga15_adults_health_risk_factor_estimates_-_2014-2015")

for i in range(len(filepath)):
    if dbname[i] in couch:
        db = couch[dbname[i]]
    else:
        db = couch.create(dbname[i])

    with open(filebasepath+filepath[i], "r") as read_file:
        data = json.load(read_file)
        for doc in data["features"]:
            if id in doc["properties"].keys():
                doc["properties"].pop("id")
            doc.update(doc["properties"])
            doc.pop("properties")
            db[doc["id"]] = doc