import axios from 'axios';

const url = 'https://api.covidtracking.com/v1/states/current.json';

export const grabDataTest = async() => {
    try{
        // destructuring. retreiving the data in the long json that comes from axios.get
        const { data } = await axios.get(url);
        
        return data; // it's an array with indexes refering to different states. data[0].state = AK
    }catch(err){

    }
}