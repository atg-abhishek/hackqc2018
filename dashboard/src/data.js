const cityMap = {
  laval: dataLaval,
  montreal: data
};

export function dataForCity({ city, municipality }) {
  if (city === "laval") {
    const toLbs = ton => ton * 2000;
    const toLbsPerPerson = totalTons => toLbs(totalTons) / 400000;

    const month = dataLaval.find(
      d => d["annee-mois"] === "2017-06-01 00:00:00" && d.collecte === "COLLECTE DES ORDURES"
    ).poids;

    return {
      municipality: {},
      city: {
        month: toLbsPerPerson(month),
        this_week: toLbsPerPerson(month / 4.33),
        last_week: toLbsPerPerson(month / 4.33),
        year: toLbsPerPerson(
          dataLaval
            .filter(d => d["annee-mois"].startsWith("2017") && d.collecte === "COLLECTE DES ORDURES")
            .map(d => d.poids)
            .reduce((acc, v) => acc + v, 0)
        )
      }
    };
  } else {
    const toLbs = kg => kg * 2.2;

    const cityData = data.find(d => d.ville === "Agglomération de Montréal");
    const cityYearGarbage =
      cityData.quantite_material_secs_encombrants_ratio_kg_personne +
      cityData.quantite_ordure_menageres_ratio_kg_personne;

    const municipalityData = data.find(d => d.ville === municipality);
    const municipalityYearGarbage =
      municipalityData.quantite_material_secs_encombrants_ratio_kg_personne +
      municipalityData.quantite_ordure_menageres_ratio_kg_personne;

    return {
      municipality: {
        this_week: toLbs(municipalityYearGarbage) / 52,
        last_week: toLbs(municipalityYearGarbage) / 52,
        month: toLbs(municipalityYearGarbage) / 12,
        year: toLbs(municipalityYearGarbage)
      },
      city: {
        this_week: toLbs(cityYearGarbage) / 52,
        last_week: toLbs(cityYearGarbage) / 52,
        month: toLbs(cityYearGarbage) / 12,
        year: toLbs(cityYearGarbage)
      }
    };
  }
}

export const messageCollect = {
  type: "Feature",
  properties: {
    ID: "LCH-1",
    MUNICIPALITE: "Montreal",
    SECTEUR: "LCH-1",
    TYPE_DECHET: "Matières organiques",
    MESSAGE_FR:
      "Jour(s) de collecte : Mercredi  Heures de dépôt : Entre 19 h la veille et 7 h le jour de la collecte Contenants acceptés : Bacs bruns fournis par la Ville  En cas de surplus de résidus verts, utilisez les contenants suivants :   - Contenants rigides réutilisables   - Sacs en papier   - Boites de carton  * les sacs en plastique ne sont pas acceptés\n",
    MESSAGE_EN:
      "Collection day(s) :  Wednesday Hours : Take out containers between 7 p.m. the evening before and 7 a.m. the day of collection Accepted containers : Brown bins provided by the city  If you should have a surplus of green waste, use the following containers :   - Reusable rigid containers   - Paper bags   - cardboard boxes *Plastic bags are not accepted"
  }
};

export const dataLaval = [
  {
    "annee-mois": "2015-01-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 8140.62
  },
  {
    "annee-mois": "2015-02-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 6882.82
  },
  {
    "annee-mois": "2015-03-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 8332.85
  },
  {
    "annee-mois": "2015-04-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 12213.43
  },
  {
    "annee-mois": "2015-05-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 15063.08
  },
  {
    "annee-mois": "2015-06-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 15652.56
  },
  {
    "annee-mois": "2015-07-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 14316.14
  },
  {
    "annee-mois": "2015-08-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 12961.1
  },
  {
    "annee-mois": "2015-09-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 12779.88
  },
  {
    "annee-mois": "2015-10-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 13491.12
  },
  {
    "annee-mois": "2015-11-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 11808.2
  },
  {
    "annee-mois": "2015-12-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 9459.42
  },
  {
    "annee-mois": "2015-01-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2629.67
  },
  {
    "annee-mois": "2015-02-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2233.05
  },
  {
    "annee-mois": "2015-03-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2658.38
  },
  {
    "annee-mois": "2015-04-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 3230.94
  },
  {
    "annee-mois": "2015-05-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 3123.83
  },
  {
    "annee-mois": "2015-06-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 3329.53
  },
  {
    "annee-mois": "2015-07-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 3093.57
  },
  {
    "annee-mois": "2015-08-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2731.2
  },
  {
    "annee-mois": "2015-09-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 3036.91
  },
  {
    "annee-mois": "2015-10-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 3078.31
  },
  {
    "annee-mois": "2015-11-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2951.56
  },
  {
    "annee-mois": "2015-12-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 3275.68
  },
  {
    "annee-mois": "2016-01-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 7969.53
  },
  {
    "annee-mois": "2016-02-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 7562.25
  },
  {
    "annee-mois": "2016-03-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 9215.86
  },
  {
    "annee-mois": "2016-04-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 11320.15
  },
  {
    "annee-mois": "2016-05-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 14576.79
  },
  {
    "annee-mois": "2016-06-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 14352.58
  },
  {
    "annee-mois": "2016-07-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 12951.12
  },
  {
    "annee-mois": "2016-08-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 13336.4
  },
  {
    "annee-mois": "2016-09-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 12203.46
  },
  {
    "annee-mois": "2016-10-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 11866.69
  },
  {
    "annee-mois": "2016-11-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 12653.93
  },
  {
    "annee-mois": "2016-12-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 8719.51
  },
  {
    "annee-mois": "2016-01-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2638.67
  },
  {
    "annee-mois": "2016-02-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2341.43
  },
  {
    "annee-mois": "2016-03-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2867.17
  },
  {
    "annee-mois": "2016-04-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2933.94
  },
  {
    "annee-mois": "2016-05-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 3207.9
  },
  {
    "annee-mois": "2016-06-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 3223.67
  },
  {
    "annee-mois": "2016-07-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2850.37
  },
  {
    "annee-mois": "2016-08-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 3075.76
  },
  {
    "annee-mois": "2016-09-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2993.15
  },
  {
    "annee-mois": "2016-10-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2814.67
  },
  {
    "annee-mois": "2016-11-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 3152.32
  },
  {
    "annee-mois": "2016-12-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2907.81
  },
  {
    "annee-mois": "2017-01-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 8706.6
  },
  {
    "annee-mois": "2017-02-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 7381.59
  },
  {
    "annee-mois": "2017-03-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 8737.76
  },
  {
    "annee-mois": "2017-04-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 11807.34
  },
  {
    "annee-mois": "2017-05-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 15522.24
  },
  {
    "annee-mois": "2017-06-01 00:00:00",
    collecte: "COLLECTE DES ORDURES",
    poids: 14738.68
  },
  {
    "annee-mois": "2017-01-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2741.68
  },
  {
    "annee-mois": "2017-02-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2174.6
  },
  {
    "annee-mois": "2017-03-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2701.89
  },
  {
    "annee-mois": "2017-04-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 2879.74
  },
  {
    "annee-mois": "2017-05-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 3405.89
  },
  {
    "annee-mois": "2017-06-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES RECYCLABLES",
    poids: 3299.83
  },
  {
    "annee-mois": "2017-01-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES ORGANIQUES",
    poids: 148.57
  },
  {
    "annee-mois": "2017-02-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES ORGANIQUES",
    poids: 93.36
  },
  {
    "annee-mois": "2017-03-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES ORGANIQUES",
    poids: 149.14
  },
  {
    "annee-mois": "2017-04-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES ORGANIQUES",
    poids: 327.91
  },
  {
    "annee-mois": "2017-05-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES ORGANIQUES",
    poids: 807.68
  },
  {
    "annee-mois": "2017-06-01 00:00:00",
    collecte: "COLLECTE DES MATIÈRES ORGANIQUES",
    poids: 1252.56
  }
];

export const data = [
  {
    ville: "Agglomération de Montréal",
    quantite_ordure_menageres_tonnes: 498154.523,
    quantite_ordure_menageres_ratio_kg_personne: 249.3632812,
    quantite_material_secs_encombrants_tonnes: 28531.2948,
    quantite_material_secs_encombrants_ratio_kg_personne: 14.28202889
  },
  {
    ville: "Ville de Montréal",
    quantite_ordure_menageres_tonnes: 440587.15,
    quantite_ordure_menageres_ratio_kg_personne: 251.3283542,
    quantite_material_secs_encombrants_tonnes: 24390.88,
    quantite_material_secs_encombrants_ratio_kg_personne: 13.91352364
  },
  {
    ville: "Ahuntsic/Cartierville",
    quantite_ordure_menageres_tonnes: 34108.84778,
    quantite_ordure_menageres_ratio_kg_personne: 249.9530839,
    quantite_material_secs_encombrants_tonnes: 1426.49,
    quantite_material_secs_encombrants_ratio_kg_personne: 10.45346289
  },
  {
    ville: "Anjou",
    quantite_ordure_menageres_tonnes: 11790.26,
    quantite_ordure_menageres_ratio_kg_personne: 264.5513497,
    quantite_material_secs_encombrants_tonnes: 177.54,
    quantite_material_secs_encombrants_ratio_kg_personne: 3.983665044
  },
  {
    ville: "Baie d'Urfé",
    quantite_ordure_menageres_tonnes: 1443.48,
    quantite_ordure_menageres_ratio_kg_personne: 370.1230769,
    quantite_material_secs_encombrants_tonnes: 41.196,
    quantite_material_secs_encombrants_ratio_kg_personne: 10.56307692
  },
  {
    ville: "Beaconsfield",
    quantite_ordure_menageres_tonnes: 3591.04,
    quantite_ordure_menageres_ratio_kg_personne: 181.3564971,
    quantite_material_secs_encombrants_tonnes: 944.448,
    quantite_material_secs_encombrants_ratio_kg_personne: 47.696985
  },
  {
    ville: "CDN / NDG",
    quantite_ordure_menageres_tonnes: 41040.85778,
    quantite_ordure_menageres_ratio_kg_personne: 237.2838835,
    quantite_material_secs_encombrants_tonnes: 1948.92,
    quantite_material_secs_encombrants_ratio_kg_personne: 11.26797371
  },
  {
    ville: "Côte-St-Luc",
    quantite_ordure_menageres_tonnes: 7961.86,
    quantite_ordure_menageres_ratio_kg_personne: 235.230892,
    quantite_material_secs_encombrants_tonnes: 920.67,
    quantite_material_secs_encombrants_ratio_kg_personne: 27.20093361
  },
  {
    ville: "DDO",
    quantite_ordure_menageres_tonnes: 13535.31,
    quantite_ordure_menageres_ratio_kg_personne: 266.5008171,
    quantite_material_secs_encombrants_tonnes: 47.568,
    quantite_material_secs_encombrants_ratio_kg_personne: 0.936580756
  },
  {
    ville: "Dorval",
    quantite_ordure_menageres_tonnes: 4497.763,
    quantite_ordure_menageres_ratio_kg_personne: 231.4735732,
    quantite_material_secs_encombrants_tonnes: 498.5048,
    quantite_material_secs_encombrants_ratio_kg_personne: 25.6551284
  },
  {
    ville: "Hampstead",
    quantite_ordure_menageres_tonnes: 1653.81,
    quantite_ordure_menageres_ratio_kg_personne: 227.2029125,
    quantite_material_secs_encombrants_tonnes: 71.202,
    quantite_material_secs_encombrants_ratio_kg_personne: 9.781838165
  },
  {
    ville: "Île Bizard /Ste-Geneviève",
    quantite_ordure_menageres_tonnes: 5561.33,
    quantite_ordure_menageres_ratio_kg_personne: 290.8189092,
    quantite_material_secs_encombrants_tonnes: 344.844,
    quantite_material_secs_encombrants_ratio_kg_personne: 18.03294462
  },
  {
    ville: "Kirkland",
    quantite_ordure_menageres_tonnes: 4254.14,
    quantite_ordure_menageres_ratio_kg_personne: 200.006582,
    quantite_material_secs_encombrants_tonnes: 609.6,
    quantite_material_secs_encombrants_ratio_kg_personne: 28.66008463
  },
  {
    ville: "Lachine",
    quantite_ordure_menageres_tonnes: 12835.48,
    quantite_ordure_menageres_ratio_kg_personne: 285.2138746,
    quantite_material_secs_encombrants_tonnes: 162.312,
    quantite_material_secs_encombrants_ratio_kg_personne: 3.606692887
  },
  {
    ville: "LaSalle",
    quantite_ordure_menageres_tonnes: 18962.96,
    quantite_ordure_menageres_ratio_kg_personne: 238.0756048,
    quantite_material_secs_encombrants_tonnes: 5924.469,
    quantite_material_secs_encombrants_ratio_kg_personne: 74.38034676
  },
  {
    ville: "Mercier/Hoch.-Mais.",
    quantite_ordure_menageres_tonnes: 36383.86778,
    quantite_ordure_menageres_ratio_kg_personne: 260.6070236,
    quantite_material_secs_encombrants_tonnes: 19.314,
    quantite_material_secs_encombrants_ratio_kg_personne: 0.138340544
  },
  {
    ville: "Montréal-Est",
    quantite_ordure_menageres_tonnes: 1652.39,
    quantite_ordure_menageres_ratio_kg_personne: 429.6385855,
    quantite_material_secs_encombrants_tonnes: 128.724,
    quantite_material_secs_encombrants_ratio_kg_personne: 33.46957878
  },
  {
    ville: "Montréal-Nord",
    quantite_ordure_menageres_tonnes: 22720.41,
    quantite_ordure_menageres_ratio_kg_personne: 254.8702675,
    quantite_material_secs_encombrants_tonnes: 769.038,
    quantite_material_secs_encombrants_ratio_kg_personne: 8.626821471
  },
  {
    ville: "Montréal-Ouest",
    quantite_ordure_menageres_tonnes: 1296.81,
    quantite_ordure_menageres_ratio_kg_personne: 248.8123561,
    quantite_material_secs_encombrants_tonnes: 0,
    quantite_material_secs_encombrants_ratio_kg_personne: 0
  },
  {
    ville: "Mont-Royal",
    quantite_ordure_menageres_tonnes: 5106.59,
    quantite_ordure_menageres_ratio_kg_personne: 244.6973981,
    quantite_material_secs_encombrants_tonnes: 295.71,
    quantite_material_secs_encombrants_ratio_kg_personne: 14.16982127
  },
  {
    ville: "Outremont",
    quantite_ordure_menageres_tonnes: 5719.11,
    quantite_ordure_menageres_ratio_kg_personne: 228.3716008,
    quantite_material_secs_encombrants_tonnes: 921.354,
    quantite_material_secs_encombrants_ratio_kg_personne: 36.79087969
  },
  {
    ville: "Pierrefonds/Roxboro",
    quantite_ordure_menageres_tonnes: 19337,
    quantite_ordure_menageres_ratio_kg_personne: 267.0893244,
    quantite_material_secs_encombrants_tonnes: 102.456,
    quantite_material_secs_encombrants_ratio_kg_personne: 1.415157668
  },
  {
    ville: "Plateau Mont-Royal",
    quantite_ordure_menageres_tonnes: 30960.19778,
    quantite_ordure_menageres_ratio_kg_personne: 294.4692053,
    quantite_material_secs_encombrants_tonnes: 258.144,
    quantite_material_secs_encombrants_ratio_kg_personne: 2.455263984
  },
  {
    ville: "Pointe-Claire",
    quantite_ordure_menageres_tonnes: 6157.16,
    quantite_ordure_menageres_ratio_kg_personne: 193.026522,
    quantite_material_secs_encombrants_tonnes: 135.516,
    quantite_material_secs_encombrants_ratio_kg_personne: 4.248416829
  },
  {
    ville: "RDP / PAT",
    quantite_ordure_menageres_tonnes: 26462.81778,
    quantite_ordure_menageres_ratio_kg_personne: 237.0859079,
    quantite_material_secs_encombrants_tonnes: 2805.291,
    quantite_material_secs_encombrants_ratio_kg_personne: 25.1331876
  },
  {
    ville: "Rosemont/ Petite-Patrie",
    quantite_ordure_menageres_tonnes: 32437.58778,
    quantite_ordure_menageres_ratio_kg_personne: 227.5076644,
    quantite_material_secs_encombrants_tonnes: 3182.03,
    quantite_material_secs_encombrants_ratio_kg_personne: 22.31781902
  },
  {
    ville: "Ste-Anne-de-Bellevue",
    quantite_ordure_menageres_tonnes: 1301.61,
    quantite_ordure_menageres_ratio_kg_personne: 261.3674699,
    quantite_material_secs_encombrants_tonnes: 70.212,
    quantite_material_secs_encombrants_ratio_kg_personne: 14.09879518
  },
  {
    ville: "St-Laurent",
    quantite_ordure_menageres_tonnes: 20998.03,
    quantite_ordure_menageres_ratio_kg_personne: 206.816015,
    quantite_material_secs_encombrants_tonnes: 1314.421,
    quantite_material_secs_encombrants_ratio_kg_personne: 12.94613415
  },
  {
    ville: "St-Léonard",
    quantite_ordure_menageres_tonnes: 21462.97,
    quantite_ordure_menageres_ratio_kg_personne: 262.4572924,
    quantite_material_secs_encombrants_tonnes: 652.476,
    quantite_material_secs_encombrants_ratio_kg_personne: 7.978722624
  },
  {
    ville: "Senneville",
    quantite_ordure_menageres_tonnes: 217.22,
    quantite_ordure_menageres_ratio_kg_personne: 233.8213132,
    quantite_material_secs_encombrants_tonnes: 13.824,
    quantite_material_secs_encombrants_ratio_kg_personne: 14.88051668
  },
  {
    ville: "Sud-Ouest",
    quantite_ordure_menageres_tonnes: 19973.05778,
    quantite_ordure_menageres_ratio_kg_personne: 255.9762361,
    quantite_material_secs_encombrants_tonnes: 98.382,
    quantite_material_secs_encombrants_ratio_kg_personne: 1.260871237
  },
  {
    ville: "Verdun",
    quantite_ordure_menageres_tonnes: 16121.82,
    quantite_ordure_menageres_ratio_kg_personne: 228.5907525,
    quantite_material_secs_encombrants_tonnes: 382.17,
    quantite_material_secs_encombrants_ratio_kg_personne: 5.418775788
  },
  {
    ville: "Ville-Marie",
    quantite_ordure_menageres_tonnes: 24068.81778,
    quantite_ordure_menageres_ratio_kg_personne: 271.0482976,
    quantite_material_secs_encombrants_tonnes: 1535.322,
    quantite_material_secs_encombrants_ratio_kg_personne: 17.28985687
  },
  {
    ville: "Vill./St-M./Parc-Ext.",
    quantite_ordure_menageres_tonnes: 39641.72778,
    quantite_ordure_menageres_ratio_kg_personne: 265.9180129,
    quantite_material_secs_encombrants_tonnes: 2365.907,
    quantite_material_secs_encombrants_ratio_kg_personne: 15.87058192
  },
  {
    ville: "Westmount",
    quantite_ordure_menageres_tonnes: 4898.19,
    quantite_ordure_menageres_ratio_kg_personne: 237.5340672,
    quantite_material_secs_encombrants_tonnes: 363.24,
    quantite_material_secs_encombrants_ratio_kg_personne: 17.61505262
  }
];
