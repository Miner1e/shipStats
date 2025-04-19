import {read, sfc32, cyrb128} from "./util.js";
let shipStartValue = await read("./config/stats/ships.json");
let ammunition = await read("./config/stats/ammunition.json");

function page_builder (shipType, language, shipCount, wind) {
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
  leftSide.children[leftSide.children.length-1].textContent = language.remaining + ": " + 0; 
  leftSide.children[leftSide.children.length-1].id = "ammoShow_ship_" + shipCount;

  leftSide.appendChild(document.createElement("button"));
  leftSide.children[leftSide.children.length-1].textContent = " buy 1x"; 
  leftSide.children[leftSide.children.length-1].id = "ammoBuy";
  leftSide.children[leftSide.children.length-1].className = "ship_" + shipCount;

  let cannonDiv = document.createElement("div");
  leftSide.appendChild(cannonDiv);
  let cannonGrid = document.createElement("table");
  cannonDiv.appendChild(cannonGrid)
  let row = document.createElement("tr");
  row.className = "cannons";
  cannonGrid.appendChild(row);
  row.appendChild(document.createElement("td"));
  for(let i in data.cannons.bow){
    let cannonImage = document.createElement("img");
    row.children[row.children.length-1].appendChild(cannonImage);
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
    for(let i = 0; i<data.cannons.port.length/data.shipLength; i++){
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
    for(let i = 0; i<data.cannons.starboard.length/data.shipLength; i++){
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
  row.appendChild(document.createElement("td"));
  for(let i in data.cannons.stern){
    let cannonImage = document.createElement("img");
    row.children[row.children.length-1].appendChild(cannonImage);
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
  rightSide.children[rightSide.children.length-1].textContent = language.movement_points + " 0° ⟳";
  rightSide.children[rightSide.children.length-1].id = "rotateMovementCanvas"

  rightSide.appendChild(document.createElement("div"))
  rightSide.children[rightSide.children.length-1].id = "movementCanvas"

  const movementCanvas = document.createElement("canvas");
  rightSide.children[rightSide.children.length-1].appendChild(movementCanvas);
  movementCanvas.style.width = "100%";
  movementCanvas.id = "movementCanvas_" + shipCount;
  movementCanvas.classList.add("rod:0")

  drawMovementCanvas(movementCanvas, data, 0, wind);

  /*const divvy = document.createElement("div");
  divvy.classList.add("extend");
  rightSide.appendChild(divvy);
  divvy.appendChild(document.createElement("div"));
  divvy.children[0].innerHTML = "<div>hi</div><div>hi</div>";
  divvy.children[0].className = "extention";
  divvy.appendChild(document.createElement("h2"));
  divvy.children[1].textContent = "test";
  divvy.children[1].className = "extend"
  divvy.appendChild(document.createElement("div"));
  divvy.children[2].innerHTML = "<div>hi</div><div>hi</div>";
  divvy.children[2].className = "extention";*/

  rightSide.appendChild(document.createElement("h2"));
  rightSide.children[rightSide.children.length-1].textContent = "schiffTeilen";
  rightSide.children[rightSide.children.length-1].id = "shareShip";
  for(let i = 0; i<10; i++){
    rightSide.appendChild(document.createElement("h2"));
    rightSide.children[rightSide.children.length-1].textContent = "filler";
  }
  let del = document.createElement("div");
  rightSide.appendChild(del);
  del.innerText = "entfernen";
  del.id = "removeShip";
  del.className = "ship_" + shipCount;
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
  adjustRow.children[2].className = "values extend";
  adjustRow.children[2].style = "cursor: url('./pictures/cursors/plus.png'), pointer;;";
  adjustRow.children[2].textContent = "+";
  return adjustTable;
}
function drawMovementCanvas(movementCanvas, data, rotation, wind){
  const ctx = movementCanvas.getContext("2d");
  ctx.reset();
  //ctx.clearRect(0,0, movementCanvas.width, movementCanvas.height);
  let centerX = movementCanvas.width/2;
  let centerY = movementCanvas.height/2;
  ctx.fillText("⟳" + data.movementPoints.rotation, 0, ctx.measureText("⟳" + data.movementPoints.rotation).actualBoundingBoxAscent + ctx.measureText("⟳" + data.movementPoints.rotation).actualBoundingBoxDescent);
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation*Math.PI/2);
  ctx.translate(-centerX, -centerY);
  /*ctx.moveTo(centerX-movementCanvas.height*0.75/2, centerY*0.25);
  ctx.lineTo(centerX, centerY*0.125);
  ctx.lineTo(centerX+movementCanvas.height*0.75/2, centerY*0.25);
  ctx.rect(centerX-movementCanvas.height*0.75/2, centerY*0.25, movementCanvas.height*0.75, movementCanvas.height*0.75);*/

  ctx.fillText(printMovementPoints(data.movementPoints.bow, wind[(2*rotation)%8]), centerX-ctx.measureText(printMovementPoints(data.movementPoints.bow, wind[0])).width/2, centerY*0.125-2);
  ctx.fillText(printMovementPoints(data.movementPoints.bow_port, wind[(2*rotation+7)%8]), centerX-movementCanvas.height*0.75/2-2, centerY*0.25);
  ctx.fillText(printMovementPoints(data.movementPoints.bow_starboard, wind[(2*rotation+1)%8]), centerX+movementCanvas.height*0.75/2+2-ctx.measureText(printMovementPoints(data.movementPoints.bow_starboard, wind[0])).width, centerY*0.25);
  ctx.fillText(printMovementPoints(data.movementPoints.port, wind[(2*rotation+6)%8]), centerX-movementCanvas.height*0.75/2-2, centerY);
  ctx.fillText(printMovementPoints(data.movementPoints.starboard, wind[(2*rotation+2)%8]), centerX+movementCanvas.height*0.75/2+2-ctx.measureText(printMovementPoints(data.movementPoints.starboard, wind[(2*rotation+2)%8])).width, centerY);
  ctx.fillText(printMovementPoints(data.movementPoints.stern, wind[(2*rotation+4)%8]), centerX-ctx.measureText(printMovementPoints(data.movementPoints.stern, wind[(2*rotation+4)%8])).width/2, movementCanvas.height*0.875 + 2 + ctx.measureText(data.movementPoints.stern).actualBoundingBoxAscent + ctx.measureText(data.movementPoints.stern).actualBoundingBoxDescent);
  ctx.stroke();
  ctx.translate(centerX, centerY);
  ctx.rotate(-rotation*Math.PI/2);
  ctx.translate(-centerX, -centerY);
}

function printMovementPoints(baseSpeed, wind){
  return baseSpeed[0]+wind + "(" + baseSpeed[0] + ((wind<0)?"-":"+") + Math.abs(wind) + ")/" + baseSpeed[1]
}









export { page_builder, adjustBuilder, drawMovementCanvas }
