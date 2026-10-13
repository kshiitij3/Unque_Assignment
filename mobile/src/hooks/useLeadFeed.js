import { useCallback, useEffect, useState } from "react";
import { fetchLeads } from "../services/leadService";
import {connectLeadSocket} from "../services/socketService";
import {mergeLeads} from "../utils/mergeLeads";


export default function useLeadFeed(){
  const [leads,setLeads] = useState([]);
  const [loading,setLoading] = useState(true);
  const [refreshing,setRefreshing] = useState(false);
  const [connectionStatus,setConnectionStatus] = 
  useState("connecting");
  const [error,setError] = useState("");

  const loadLeads = useCallback( async(isRefresh =false) =>{
    if(isRefresh){
      setRefreshing(true);
    }
    else{
      setLoading(true);
    }

    try{
      const fetchedLeads = await fetchLeads();

      setLeads((current) => mergeLeads(fetchedLeads,current));
      setError("");
    }
    catch(err){
      setError(err.message || "could not load leads.");
    }
    finally{
      setLoading(false);
      setRefreshing(false);
    }
  },[]);


  useEffect(()=>{
    const socket = connectLeadSocket({
      onConnect: ()=>{
        setConnectionStatus("live");
      },
        onDisconnect: () => {
        setConnectionStatus("reconnecting");
      },

      onConnectError: () => {
        setConnectionStatus("offline");
      },
     onNewLead: (newLead) => {
        setLeads((current) => mergeLeads(current, [newLead]));
        setError("");
      },
    });

    loadLeads();

    return ()=>{
      socket.disconnect();

    };
  },[loadLeads]);

  const refreshLeads = useCallback(()=>{
    return loadLeads(true);
  },[loadLeads]);

  return {
    leads,loading,refreshing, connectionStatus, error, refreshLeads,
  };
}
