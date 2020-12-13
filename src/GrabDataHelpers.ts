import axios from "axios";
const base_url = "https://covid19.mathdro.id/api";

export const fetchData = async (country) => {
    let changeableUrl = base_url;
    if (country) {
      changeableUrl = `${base_url}/countries/${country}`;
    }
  
    try {
      const {
        data: { confirmed, recovered, deaths, lastUpdate },
      } = await axios.get(changeableUrl);
  
      return {
        confirmed,
        recovered,
        deaths,
        lastUpdate,
      };
    } 
    catch (err) {
      console.log(err);
    }
  };
  

export async function grabData<TPrototype, TResultantType>(
    url: string,
    converter: (val: TPrototype, index: number) => TResultantType)
    : Promise<TResultantType[]> {
    const response = await fetch(url);
    const body = await response.json();
    return body.map(converter);
}

