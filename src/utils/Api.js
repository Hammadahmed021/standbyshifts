import axios from "axios";

const BASE_URL = 'https://virtualrealitycreators.com/tablenow-backend/api/'
const API_KEY = import.meta.env.VITE_APP_KEY; // Ensure this is correctly set

// const headers = {
//     Authorization: `bearer${KEY}`  ,
// };


export const getListDetails = async (url, params) => {
    console.log(API_KEY, 'key');
    try{
        const {data} = await axios.get(`${BASE_URL}${url}?`, 
        //  {
        //     // headers,
        //     params:{
        //         ...params,
        //         api_key: API_KEY
        //     }
        // }
    )
        // const res = req.data;
        return data
    } catch(error){
        return error
    }
}



