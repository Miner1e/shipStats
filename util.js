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
export { read, getShipID };