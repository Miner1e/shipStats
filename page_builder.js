import {read} from "./util.js";
let shipStartValue = await read("./config/stats/ships.json");
let ammunition = await read("./config/stats/ammunition.json");

function page_builder (shipType, language, shipCount) {
  let data = structuredClone(shipStartValue[shipType]);
  let html = "";

  let shipPage = document.createElement("div");
  shipPage.classList.add("ship_stats");
  shipPage.id = "ship_" + shipCount;

  let leftSide = document.createElement("div");
  shipPage.appendChild(leftSide);
  leftSide.style = "display: inline-block; *display: inline; zoom: 1; vertical-align: top; width: 50%;";
  
  let rightSide = document.createElement("div");
  shipPage.appendChild(rightSide);
  rightSide.style = "display: inline-block; *display: inline; zoom: 1; vertical-align: top; width: 50%;";


  leftSide.appendChild(document.createElement("h2"));
  leftSide.children[0].textContent = language.hull;

  let hullList = document.createElement("table");
  leftSide.appendChild(hullList);
  hullList.className = "hull";
  hullList.appendChild(document.createElement("tr"));
  hullList.children[0].style.height = "50%";
  hullList.children[0].style.textAlign = "center%";

  hullList.appendChild(document.createElement("tr"));
  hullList.children[1].style.height = "50%";
  hullList.children[1].style.textAlign = "center%";

  Object.keys(data.hull).forEach((stat, i) => {
    hullList.children[0].appendChild(document.createElement("td"));
    hullList.children[0].children[i].className = "hull_elements";
    hullList.children[0].children[i].textContent = language[Object.keys(data.hull)[i]];

    let slot = document.createElement("td");
    hullList.children[1].appendChild(slot);
    slot.className = "hull_elements";
    slot.appendChild(adjustBuilder("hull_" + stat, data.hull[stat]));
    /*slot.appendChild(document.createElement("table"));
    slot.children[0].className = "values_table hull_" + stat


    let adjustRow = document.createElement("tr");
    slot.children[0].appendChild(adjustRow);
    adjustRow.className = "values_table_row";
    adjustRow.appendChild(document.createElement("td"));
    adjustRow.children[0].id = "minus";
    adjustRow.children[0].className = "values";
    adjustRow.children[0].style = "cursor: url('./pictures/cursors/minus.png'), pointer;;";
    adjustRow.children[0].textContent = "-";

    adjustRow.appendChild(document.createElement("td"));
    adjustRow.children[1].className = "values";
    adjustRow.children[1].style = "border: solid #726454; width: 50%;";
    adjustRow.children[1].textContent = data.hull[stat];

    adjustRow.appendChild(document.createElement("td"));
    adjustRow.children[2].id = "plus";
    adjustRow.children[2].className = "values";
    adjustRow.children[2].style = "cursor: url('./pictures/cursors/plus.png'), pointer;;";
    adjustRow.children[2].textContent = "+";*/
  });
  leftSide.appendChild(document.createElement("h2"));
  leftSide.children[leftSide.children.length-1].textContent = language.cannons; 
  const ammoSelect = document.createElement("select");
  leftSide.appendChild(ammoSelect);
  ammoSelect.id = "ammoSelect_ship_" + shipCount;
  for(const shot in ammunition){
    ammoSelect.appendChild(document.createElement("option"));
    ammoSelect.children[ammoSelect.children.length-1].textContent = language[shot];
    ammoSelect.children[ammoSelect.children.length-1].value = shot;
  }
  leftSide.appendChild(document.createElement("span"));
  leftSide.children[leftSide.children.length-1].textContent = language.remaining + ": " + ammunition[ammoSelect.value].max_storage; 
  leftSide.children[leftSide.children.length-1].id = "ammoShow_ship_" + shipCount;


  let cannonDiv = document.createElement("div");
  leftSide.appendChild(cannonDiv);
  let cannonGrid = document.createElement("table");
  cannonDiv.appendChild(cannonGrid)
  let row = document.createElement("tr");
  row.className = "cannons";
  cannonGrid.appendChild(row);
  for(let i in data.cannons.bow){
    let cannonImage = document.createElement("img");
    row.appendChild(cannonImage);
    cannonImage.id = "card_slot";
    cannonImage.className = "card_slot bow_" + (JSON.parse(i) + 1);
    cannonImage.src = "./pictures/cards/cannons/empty.png";
    cannonImage.style.width = 90/(data.cannons.port.length/data.shipLength) + "%";
  }
  row.appendChild(document.createElement("img"));
  row.children[row.children.length-1].src = "./pictures/cards/shipSlots.png";
  row.children[row.children.length-1].id = "shoot";
  row.children[row.children.length-1].className = "bow";
  for(let j = 0; j<data.shipLength; j++){
    row = document.createElement("tr");
    row.className = "cannons";
    cannonGrid.appendChild(row);
    row.appendChild(document.createElement("td"));
    row.children[0].style.width = "45%"
    row.children[0].style.textAlign = "center";
    for(let i = 0; i<data.cannons.port.length/3; i++){
      let cannonImage = document.createElement("img");
      row.children[0].appendChild(cannonImage);
      cannonImage.id = "card_slot";
      cannonImage.className = "card_slot port_" + (JSON.parse(i) + 1);
      cannonImage.src = "./pictures/cards/cannons/empty.png";
      cannonImage.style.width = 100/(data.cannons.port.length/data.shipLength) + "%";
    }
    row.children[0].appendChild(document.createElement("img"));

    row.appendChild(document.createElement("td"));

    row.children[1].style.width = "10%"
    row.children[1].style.textAlign = "center";
    row.children[1].appendChild(document.createElement("img"));
    row.children[1].children[0].src = "./pictures/cards/shipSlots.png";
    row.children[1].children[0].id = "shoot";
    row.children[1].children[0].className = "sides";
    row.children[1].children[0].style.width = "100%";
    row.appendChild(document.createElement("td"));
    row.children[2].style.width = "45%"
    row.children[2].style.textAlign = "center";
    for(let i = 0; i<data.cannons.starboard.length/3; i++){
      let cannonImage = document.createElement("img");
      row.children[2].appendChild(cannonImage);
      cannonImage.id = "card_slot";
      cannonImage.className = "card_slot starboard_" + (JSON.parse(i) + 1);
      cannonImage.src = "./pictures/cards/cannons/empty.png";
      cannonImage.style.width = 100/(data.cannons.starboard.length/data.shipLength) + "%";
    }
  }
  row = document.createElement("tr");
  row.className = "cannons";
  cannonGrid.appendChild(row);
  for(let i in data.cannons.stern){
    let cannonImage = document.createElement("img");
    row.appendChild(cannonImage);
    cannonImage.id = "card_slot";
    cannonImage.className = "card_slot stern_" + (JSON.parse(i) + 1);
    cannonImage.src = "./pictures/cards/cannons/empty.png";
    cannonImage.style.width = 90/(data.cannons.port.length/data.shipLength) + "%";
  }
  row.appendChild(document.createElement("img"));
  row.children[row.children.length-1].src = "./pictures/cards/shipSlots.png";
  row.children[row.children.length-1].id = "shoot";
  row.children[row.children.length-1].className = "stern";
  rightSide.appendChild(document.createElement("h2"));
  rightSide.children[rightSide.children.length-1].textContent = language.storage;
  rightSide.appendChild(document.createElement("table"));
  rightSide.children[rightSide.children.length-1].className = "hull";
  
  let supplyList = document.createElement("tr");
  rightSide.children[rightSide.children.length-1].appendChild(supplyList);
  supplyList.style = "height: 100%; text-align: center";
  supplyList.classList = "storage";

  data.storage.forEach((spot, i) =>{
    if(i%10==0) {
      supplyList = document.createElement("tr");
      rightSide.children[rightSide.children.length-1].appendChild(supplyList);
      supplyList.style = "height: 100%; text-align: center";
      supplyList.classList = "storage";
    }
    supplyList.appendChild(document.createElement("td"));
    supplyList.children[supplyList.children.length-1].style = "width: " + 100/data.storage.length + "%;";
    let itemImage = document.createElement("img");
    supplyList.children[supplyList.children.length-1].appendChild(itemImage);
    itemImage.id = "card_slot";
    itemImage.className = "card_slot " + i;
    itemImage.src = "./pictures/cards/cannons/empty.png";
    itemImage.style.width = "100%";
  })

  rightSide.appendChild(document.createElement("h2"));
  rightSide.children[rightSide.children.length-1].textContent = language.crew;
  rightSide.appendChild(document.createElement("table"));
  rightSide.children[rightSide.children.length-1].className = "hull";
  
  let crewList = document.createElement("tr");
  rightSide.children[rightSide.children.length-1].appendChild(crewList);
  crewList.style = "height: 100%; text-align: center";
  crewList.classList = "crew";

  data.crew.forEach((spot, i) => {
    if(i%10==0) {
      crewList = document.createElement("tr");
      rightSide.children[rightSide.children.length-1].appendChild(crewList);
      crewList.style = "height: 100%; text-align: center";
      crewList.classList = "crew";
    }
    crewList.appendChild(document.createElement("td"));
    crewList.children[crewList.children.length-1].style = "width: " + 100/data.crew.length + "%;";
    let itemImage = document.createElement("img");
    crewList.children[crewList.children.length-1].appendChild(itemImage);
    itemImage.id = "card_slot";
    itemImage.className = "card_slot " + i;
    itemImage.src = "./pictures/cards/cannons/empty.png";
    itemImage.style.width = "100%";
  })

  rightSide.appendChild(document.createElement("h2"));
  rightSide.children[rightSide.children.length-1].textContent = language.crew;
  return shipPage;
}
function adjustBuilder(classification, startingValue){
  const adjustTable = document.createElement("table");
  adjustTable.className = "values_table " + classification;
  let adjustRow = document.createElement("tr");
  adjustTable.appendChild(adjustRow);
  adjustRow.className = "values_table_row";
  adjustRow.appendChild(document.createElement("td"));
  adjustRow.children[0].id = "minus";
  adjustRow.children[0].className = "values";
  adjustRow.children[0].style = "cursor: url('./pictures/cursors/minus.png'), pointer;;";
  adjustRow.children[0].textContent = "-";

  adjustRow.appendChild(document.createElement("td"));
  adjustRow.children[1].className = "values";
  adjustRow.children[1].style = "border: solid #726454; width: 50%;";
  adjustRow.children[1].textContent = startingValue;

  adjustRow.appendChild(document.createElement("td"));
  adjustRow.children[2].id = "plus";
  adjustRow.children[2].className = "values";
  adjustRow.children[2].style = "cursor: url('./pictures/cursors/plus.png'), pointer;;";
  adjustRow.children[2].textContent = "+";
  return adjustTable;
}










export { page_builder, adjustBuilder }
