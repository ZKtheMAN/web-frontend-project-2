import axios from 'axios';

//can use /deaths, /daily, /recovered, /confirmed, /countries/[CountryName] on base_url
const base_url = "https://covid19.mathdro.id/api";
const original_url = "https://api.covidtracking.com/v1/states/current.json"
const global_overview_url = "https://disease.sh/v3/covid-19/all";
//Gets all data for countries
const countries_url = 'https://disease.sh/v3/covid-19/countries/';

export async function grabData<TPrototype, TResultantType>(
    url: string,
    converter: (val: TPrototype, index: number) => TResultantType)
    : Promise<TResultantType[]> {
    const response = await fetch(url);
    const body = await response.json();
    return body.map(converter);
}

// =============================
//          SAMPLE DATA
// =============================


// SORTED BY POSTAL CODE ABBREVIATION
// DUE TO HOW THE COVID TRACKING PROJECT WORKS
export var states = [
    "Alaska", "Alabama", "Arkansas","American Samoa", "Arizona",
    "California", "Colorado", "Connecticut",
    "District of Columbia","Delaware",
    "Florida",
    "Georgia", "Guam",
    "Hawaii",
    "Iowa", "Idaho", "Illinois", "Indiana",
    "Kansas", "Kentucky",
    "Louisiana",
    "Massachusetts", "Maryland", "Maine", "Michigan", "Minnesota", "Missouri", "Mariana Islands",
    "Mississippi", "Montana",
    "North Carolina", "North Dakota", "Nebraska", "New Hampshire", "New Jersey",
    "New Mexico", "Nevada", "New York",
    "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Puerto Rico",
    "Rhode Island",
    "South Carolina", "South Dakota",
    "Tennessee", "Texas",
    "Utah",
    "Virginia", "Virgin Islands", "Vermont",
    "Washington", "Wisconsin", "West Virginia", "Wyoming",
]
export const getMapData = async () => {
    try { 
        const response = await fetch(countries_url);
        //returns array of countries
        const data = await response.json();
        //first country
        console.log('first country object', data[0]);
        console.log(data[0].cases);
        console.log('latitude',data[0].countryInfo['lat']);
        console.log('longitude', data[0].countryInfo['long']);
    
        if (!data){
          console.log('failed');
          return ;}
        return data;
    } catch (error) {
        return error;
    }
  };

export const getCountryData = async (country: any)=>{
  if (country){
    let cUrl = `${countries_url}${country}`;
    console.log('url',cUrl);
    try{
        const response = await fetch(cUrl);
        const data = await response.json();
        console.log('get country',data);
    }
    catch(error){
      return error;
    }
  }
  return {};
}

export const getDailyData = async() => {
    try {
        const { data } = await axios.get(original_url);
        console.log(data);
    } catch(err){
        return err;
    }
};
export var abbreviations = [
    "AK","AL","AR","AS","AZ",
    "CA","CO","CT",
    "DC","DE",
    "FL",
    "GA","GU",
    "HI","IA",
    "ID","IL","IN",
    "KS","KY",
    "LA",
    "MA","MD","ME","MI","MN","MO","MP","MS","MT",
    "NC","ND","NE","NH","NJ","NM","NV","NY",
    "OH","OK","OR",
    "PA","PR",
    "RI",
    "SC","SD",
    "TN","TX",
    "UT",
    "VA","VI","VT",
    "WA","WI","WV","WY", 
]

export var latlngs: [number, number][] = [
    [64, -149], [32, -86], [35, -91], [-14, -170], [34, -111],
    [36, -119], [39, -105], [41, -73],
    [38, -77], [38, -75],
    [27, -81],
    [32, -82], [13, 144],
    [19, -155],
    [41, -93], [44, -114], [40, -89], [40, -86],
    [39, -98], [37, -84],
    [30, -91],
    [42, -71], [39, -76], [45, 69], [44, -85], [46, -94], [37, -91], [15, 145],
    [32, -89], [46, -110],
    [35, -79], [47, -101], [41, -99], [43, -71], [40, -74],
    [34, -105], [38, -116], [43, -74],
    [40, -82], [35, -97], [43, -120],
    [41, -77], [18, -66],
    [41, -71],
    [33, -81], [43, -99],
    [35, -86], [31, -99],
    [39, -111],
    [37, -78], [18, -64], [44, -72],
    [47, -120], [43, -88], [38, -80], [43, -107],
]