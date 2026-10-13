import {API_ENDPOINTS} from "../constants/apiEndpoints";
import {apiRequest} from "./apiClient";

export async function fetchLeads(){
const result  =  await apiRequest(API_ENDPOINTS.LEADS);


if(!Array.isArray(result.data)){
  throw new Error("Unexpected response from the leads API.");

}
   return result.data;
}
