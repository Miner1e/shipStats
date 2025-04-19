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
function sfc32(a, b, c, d) {
  return function() {
    a |= 0; b |= 0; c |= 0; d |= 0;
    let t = (a + b | 0) + d | 0;
    d = d + 1 | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}
function cyrb128(str) {
  let h1 = 1779033703, h2 = 3144134277,
      h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
}
export { read, getShipID, encodeShip, decodeShip, sfc32, cyrb128 };
