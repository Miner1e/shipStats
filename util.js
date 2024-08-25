async function read(path){
  const res = await fetch(path);
  const json = await res.json();
  return json;
    /*(fetch("./content/stats/ships.json").then((res) => {
        return res.json();
      }).then((data => {
        return data;
      })));*/
}
function getShipID(element) {
  while (![...element.classList].includes("ship_stats")) {
    element = element.parentElement
  }
  return element.id
}
async function encodeShip(data){
  let shipStartValue = await read("./config/stats/ships.json");
  let cannons = await read("./config/stats/cannons.json");
  let storage = await read("./config/stats/storage.json");
  let crew = await read("./config/stats/crew.json");
  let mapping = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVQXYZ0123456789äöüÄÖÜß ,;.:!§$%&/()=?`´²³{[]}\#'^°@€*+-~<>|_";
  let binary = "";
  //shipType
  binary += Number(Object.keys(shipStartValue).indexOf(data.type)).toString(2).padStart(5, "0");
  //cannons
  for(let side in data.cannons){
    for(let cannon of data.cannons[side]){
      if(cannon == "empty") continue;
      binary+= Number(Object.keys(cannons).indexOf(cannon)).toString(2).padStart(4, "0");
    }
  }
  //storage
  let storageMapping = {};
  for(let item of data.storage){
    if(item == "empty") continue;
    storageMapping[item]++;
    if(isNaN(storageMapping[item])) storageMapping[item] = 1;
  }
  binary+= Number(Object.keys(storageMapping).length).toString(2).padStart(6, "0");
  for(let item in storageMapping){
    binary+= Number(Object.keys(storage).indexOf(item)).toString(2).padStart(6, "0") + Number(storageMapping[item]).toString(2).padStart(6, "0");
  }
  //crew
  let crewMapping = {};
  for(let item of data.storage){
    if(item == "empty") continue;
    crewMapping[item]++;
    if(isNaN(crewMapping[item])) crewMapping[item] = 1;
  }
  binary+= Number(Object.keys(crewMapping).length).toString(2).padStart(6, "0");
  for(let item in crewMapping){
    binary+= Number(Object.keys(storage).indexOf(item)).toString(2).padStart(6, "0") + Number(crewMapping[item]).toString(2).padStart(6, "0");
  }
 // console.log(Number(25).toString(3) + " " + parseInt("1100101", 2));
 console.log(mapping.length);
 //return btoa(unescape(encodeURIComponent(binary)));
  return binary;
}
function decodeShip(data){

}
export { read, getShipID, encodeShip, decodeShip };
