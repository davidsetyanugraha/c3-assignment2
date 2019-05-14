# Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
# Team Name: Team 14
# Team Members:
#   Dading Zainal Gusti (1001261)
#   David Setyanugraha (867585)
#   Ghawady Ehmaid (983899)
#   Indah Permatasari (929578)
#   Try Ajitiono (990633)

import couchdb

# Database Configuration
COUCH_IP = '172.26.38.57'
BASE_URL = 'http://172.26.38.57:5984' #to be dynamically set
USERNAME = 'admin'
PASSWORD = 'password'
couch = couchdb.Server("http://%s:%s@%s:5984/" % (USERNAME, PASSWORD, COUCH_IP))

if 'sins_per_area' in couch:
    sindb = couch['sins_per_area']
else:
    sindb = couch.create('sins_per_area')

#couch = couchdb.Server(BASE_URL)

#= couch["lga_censusbased_t02_selected_medians_and_averages_2001"]
#= couch["lga_censusbased_t02_selected_medians_and_averages_2006"]
#= couch["lga_economic_fundamentals_indicators_2011"]

summaryview = couch["dashboard_source1"].view('_design/summary/_view/sins_per_area',group=True)

censusmediandb = (couch["lga_censusbased_t02_selected_medians_and_averages_2011"]).view('_all_docs', include_docs=True) ##
homelessdb = (couch["lga_estimating_homelessness_2016"]).view('_all_docs', include_docs=True) ##
offencdb3 = (couch["lga_number_of_offences_in_victoria_by_offence_type_2008_-_2017-3"]).view('_all_docs', include_docs=True) ##
childdb = (couch["lga_phidu_mothers_and_babies_2012-2015"]).view('_all_docs', include_docs=True) ##
healthdb = (couch["lga15_adults_health_risk_factor_estimates_-_2014-2015"]).view('_all_docs', include_docs=True) ##
seddb = (couch["lga_sedentary_behaviour_sitting_hours_per_day"]).view('_all_docs', include_docs=True) ##
housedb = (couch["lga_phidu_housing_and_transport_2016"]).view('_all_docs', include_docs=True)
demogdb = (couch["lga_profiles_data_2011"]).view('_all_docs', include_docs=True)
demogdb2 = (couch["lga_profiles_data_2015"]).view('_all_docs', include_docs=True)

sedentary={} #Sloth
for sed in seddb:
    if int(sed.doc["lga_code06"])!=29399: #Exclude Unincorporated VIC as not available in all datasets
        sedentary[int(sed.doc["lga_code06"])] = sed.doc["numeric"]

overweight={} #Gluttony
for glut in healthdb:
    if int(glut.doc["lga_code"])!=29399: #Exclude Unincorporated VIC as not available in all datasets
        overweight[int(glut.doc["lga_code"])] = glut.doc["ovrwgt_p_5_sr"]+glut.doc["obese_p_5_sr"]+glut.doc['wst_meas_p_5_sr']

sexualoffence = {} #Lust
offence = {} #Wrath
for off in offencdb3:
    if int(off.doc["lga_code"])!=29399: #Exclude Unincorporated VIC as not available in all datasets
        sexualoffence[int(off.doc["lga_code"])] = off.doc['a30_sexual_offences']+off.doc['a70_stalking_harassment__and__threatening_behaviour']
        if off.doc['a60_blackmail__and__extortion'] == None:
            offence[int(off.doc["lga_code"])] = off.doc['d20_disorderly__and__offensive_conduct'] + off.doc[
                'a20_assault__and__related_offences'] + off.doc['a10_homicide__and__related_offences']
        else:
            offence[int(off.doc["lga_code"])] = off.doc['d20_disorderly__and__offensive_conduct'] + off.doc[
                'a20_assault__and__related_offences'] + off.doc['a10_homicide__and__related_offences'] + \
                                           off.doc['a60_blackmail__and__extortion']

homelessness = {} #envy??

for homel in homelessdb:
    if int(homel.doc["lga_code16"])!=29399: #Exclude Unincorporated VIC as not available in all datasets
        homelessness[int(homel.doc["lga_code16"])] = homel.doc['hl_p_homeless_tot']

#for home in housedb:
#    if home.doc["lga_code"]!=29399: #Exclude Unincorporated VIC as not available in all datasets
#        homelessness[home.doc["lga_code"]] += home.doc['hl_p_homeless_tot']

gamblingloss = {} ##greed

for demo in demogdb2:
    if int(demo.doc["lga_code"])!=29399: #Exclude Unincorporated VIC as not available in all datasets
        gamblingloss[int(demo.doc["lga_code"])] = demo.doc['gaming_machine_losses_per_adult_pop_aud']
        #trustrate[demo.doc["lga_code"]] = demo.doc['ppl_who_believe_other_ppl_can_be_trusted_perc']
    #ppl_who_believe_other_ppl_can_be_trusted_perc ##Percentage of people who believe other people can be trusted (2011)
    #Gaming machine losses per adult population (2014-2015) (gaming_machine_losses_per_adult_pop_aud)
    #Gaming machine losses per adult population (rank) (2014-2015) (gaming_machine_losses_per_adult_pop_rank)

income = {} #Pride??
for inc in censusmediandb:
    if int(inc.doc["REGION"])!=29399: #Exclude Unincorporated VIC as not available in all datasets
        income[int(inc.doc["REGION"])] = inc.doc['MEASURE_MTFI'] #Median total family income ($/weekly)

for data in summaryview:
    #to avoid missing lga error
    if data.key[0] in sedentary:
        sedentarydata = sedentary[data.key[0]]
    else:
        sedentarydata = 0
    if data.key[0] in gamblingloss:
        gamblinglossdata = gamblingloss[data.key[0]]
    else:
        gamblinglossdata = 0
    if data.key[0] in overweight:
        overweightdata = overweight[data.key[0]]
    else:
        overweightdata = 0
    if data.key[0] in offence:
        offencedata = offence[data.key[0]]
    else:
        offencedata = 0
    if data.key[0] in sexualoffence:
        sexualoffencedata = sexualoffence[data.key[0]]
    else:
        sexualoffencedata = 0
    if data.key[0] in homelessness:
        homelessnessdata = homelessness[data.key[0]]
    else:
        homelessnessdata = 0
    if data.key[0] in overweight:
        incomedata = income[data.key[0]]
    else:
        incomedata = 0
    sindb.save({'start_city_code':data.key[0], #start_city_code
    'start_city':data.key[1], #start_city
    'sins':{'sloth':data.value[0],
            'greed':data.value[1],
            'gluttony':data.value[2],
            'wrath':data.value[3],
            'lust':data.value[4],
            'envy':data.value[5],
            'pride':data.value[6],
            },
     'aurin':{'sedentary':sedentarydata, #sloth
              'gamblingloss':gamblinglossdata, #greed
              'overweight':overweightdata, #gluttony
              'offence':offencedata, #wrath
              'sexualoffence':sexualoffencedata, #lust
              'homelessness':homelessnessdata, #envy
              'income':incomedata, #pride
            }
     })

#function (doc) {
#    emit([doc.start_city_code, doc.start_city],
#         [doc.sins.sloth,doc.sins.greed,doc.sins.gluttony,doc.sins.wrath,doc.sins.lust,doc.sins.envy,doc.sins.pride,doc.aurin.sedentary,doc.aurin.gamblingloss,doc.aurin.overweight,doc.aurin.offence,doc.aurin.sexualoffence,doc.aurin.homelessness,doc.aurin.income]);
#}