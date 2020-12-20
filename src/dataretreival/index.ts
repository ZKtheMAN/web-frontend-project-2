import axios from 'axios';

const url = 'https://api.covidtracking.com/v1/states/current.json';

export const grabDataTest = async() => {
    try{
        // destructuring. retreiving the data in the long json that comes from axios.get
        const { data: {state, positive, negative, death} } = await axios.get(url);

        return {state, positive, negative, death};
    }catch(err){

    }
}