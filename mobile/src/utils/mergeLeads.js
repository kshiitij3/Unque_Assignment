export function getLeadKey(lead){
  if(lead._id){
    return String(lead._id);
  }

  if(lead.metaLeadId){
    return String(lead.metaLeadId);
  }

  return[
    lead.name || "",
    lead.email || "",
    lead.phone || "",
    lead.createdAt || lead.leadCreatedAt || "",
  ].join("|");
}

export function mergeLeads(existing = [],incoming = []){
  const leadsMap = new Map();

  [...existing,...incoming].forEach((lead)=>{
    leadsMap.set(getLeadKey(lead),lead);
  });

  return Array.from(leadsMap.values()).sort((a,b)=>{
    const dateA = new Date(
      a.createdAt || a.leadCreatedAt || 0
    ).getTime();

    const dateB = new Date(
      b.createdAt || b.leadCreatedAt || 0
    ).getTime();

    return (
      (Number.isFinite(dateB) ? dateB : 0) -
      (Number.isFinite(dateA) ? dateA : 0)
    );
  });
}
