export function formatDate(value){
  if(!value){
    return "Date unavailable";
  }

  const date = new Date(value);

  if(Number.isNaN(date.getTime())){
    return "date inavailable";
  }

  return date.toLocaleString();
}