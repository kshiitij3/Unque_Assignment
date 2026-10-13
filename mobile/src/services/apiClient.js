import {API_URL} from '../config/api';

export async function apiRequest(path,options = {}){
  let response;

  try{
    response = await fetch(`${API_URL}${path}`,{
      ...options,
      headers:{
        Accept:"application/json",
        "Content-Type":"application/json",
        ...options.headers,
     
      },
    });
  }
  catch{
    throw new Error(
      `cannot connect to backend at ${API_URL}. Check the server and ip address.`
    );
  }

  let result;



  try{
    result = await response.json();

  } catch{
    throw new Error("The backend returned an invalid JSON response.");
  }

  if(!response.ok){
    throw new Error(result.message || `Request failed with status ${response.status}`);
  }
  return result;
}
