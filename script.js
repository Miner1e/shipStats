import {page_builder, adjustBuilder, drawMovementCanvas} from "./page_builder.js";
import {read, getShipID, encodeShip, decodeShip } from "./util.js";

let selectedLanguage = "german"
let shipStartValue = await read("./config/stats/ships.json");
let cannons = await read("./config/stats/cannons.json");
let storage = await read("./config/stats/storage.json");
let crew = await read("./config/stats/crew.json");
let ammunition = await read("./config/stats/ammunition.json");
let language = await read("./config/language/" + selectedLanguage + ".json");
let multiplier = 1;
let selectedPrice = "medium_price";
//global variables
let money = 100;
let shipCount = 1;
let ships = {}

updateMainPage();


document.addEventListener("load", async function(e){
  ships = document.cookie
  if(typeof ships != Object) ships = {};
})
document.addEventListener("click", function (e){
  switch (e.target.id) {
    case "ship_select_tab":
      if(!e.target.className.includes("ship_select_tab")) return;
      document.getElementsByClassName("ship_select_tab_active")[0].classList.remove("ship_select_tab_active");
      e.target.classList.add("ship_select_tab_active");
      try{document.getElementsByClassName("ship_stats_active")[0].classList.remove("ship_stats_active");} catch{};
      document.getElementById(e.target.classList[0]).classList.add("ship_stats_active");
      if(document.getElementById(e.target.classList[0]).id == "buy_ship_page") updateMainPage();
      break;
    case "buy_ship":
      let value = document.getElementById("ship_type").value
      if(document.getElementById("ship_type").value == "") return;
      let name = document.getElementById("shipName").value;
      if(name == "") name = language.ship + " " + shipCount;
      document.getElementById("shipName").placeholder = language.ship + " " + (shipCount + 1);
      document.getElementById("ship_select_body").innerHTML += "<td id='ship_select_tab' class='ship_" + shipCount + " ship_select_tab'>"+ name + " (" + language[document.getElementById("ship_type").value] + ")</td>";
      document.getElementById("ship_stats_body").appendChild(page_builder(value, language, shipCount));
      ships["ship_" + shipCount] = structuredClone(shipStartValue[value])
      ships["ship_" + shipCount].name = name;
      ships["ship_" + shipCount].type = value;
      ships["ship_" + shipCount].ammunition = {}
      for(const shot in ammunition){
        ships["ship_" + shipCount].ammunition[shot] = 0;
      }
      shipCount++;
      break;
    case "card":
      if(e.target.className.includes("card_active")){
        e.target.classList.remove("card_active")
        return;
      }
      try {document.getElementsByClassName("card_active")[0].classList.remove("card_active")} catch {}
      e.target.classList.add("card_active")
      break;
    case "plus":
    case "minus":
      let increase = multiplier;
      if(e.shiftKey) increase *= 5;
      if(e.ctrlKey) increase *= 10;
      if(e.target.parentElement.parentElement.classList[1] == "money"){
        money+=increase*(e.target.id=="plus"?1:-1);
        e.target.parentElement.children[1].innerHTML = money;
        return;
      }
      ships[document.getElementsByClassName("ship_stats_active")[0].id][e.target.parentElement.parentElement.classList[1].split("_")[0]][e.target.parentElement.parentElement.classList[1].split("_")[1]] += (e.target.id == "plus" ? increase : (increase*-1))
      e.target.parentElement.children[1].innerHTML = ships[document.getElementsByClassName("ship_stats_active")[0].id][e.target.parentElement.parentElement.classList[1].split("_")[0]][e.target.parentElement.parentElement.classList[1].split("_")[1]]
      if(ships[document.getElementsByClassName("ship_stats_active")[0].id][e.target.parentElement.parentElement.classList[1].split("_")[0]][e.target.parentElement.parentElement.classList[1].split("_")[1]] <= 0) e.target.parentElement.children[1].style.backgroundColor = "red"
      if(ships[document.getElementsByClassName("ship_stats_active")[0].id][e.target.parentElement.parentElement.classList[1].split("_")[0]][e.target.parentElement.parentElement.classList[1].split("_")[1]] > 0) e.target.parentElement.children[1].style.backgroundColor = ""
      break;
    case "card_slot":
      if(document.getElementById("card_insert").style.display != "block"){
        const reciever = e.target.parentElement.parentElement.className.split(" ")[0];
        let pool = cannons;
        if(reciever == "storage") pool = storage;
        if(reciever == "crew") pool = crew;

        let priceChoice = document.getElementById("price_choice");
        priceChoice.style.display = "block"
        let selection = document.getElementById("card_insert");
        selection.style.display = "block";
        let img = document.createElement("img");
        img.src = "./pictures/cards/empty.png";
        img.id = "card";
        img.classList.add("card");
        img.classList.add("empty");
        //img.style.height = "100%"
        img.style.width = "10%"
        selection.appendChild(img);
        for(const item in pool){
          img = document.createElement("img");
          img.src = "./pictures/cards/" + reciever + "/" + item + ".png";
          img.id = "card";
          img.classList.add("card");
          img.classList.add(item);
          //img.style.height = "100%"
          img.style.width = "10%"
          selection.appendChild(img);
        }
      } else if (document.getElementsByClassName("card_active").length != 0) {
        e.target.src = document.getElementsByClassName("card_active")[0].src;
        const reciever = e.target.parentElement.parentElement.className.split(" ")[0];
        if(reciever == "cannons"){
          ships[getShipID(e.target)].cannons[e.target.classList[1].split("_")[0]][e.target.classList[1].split("_")[1]-1] = document.getElementsByClassName("card_active")[0].classList[1]
          return;
        }
        if(reciever == "storage"){
          if(document.getElementsByClassName("card_active")[0].classList[1] == "empty") {
            money += storage[ships[getShipID(e.target)][reciever][e.target.classList[1]]][selectedPrice]
          } else money -= storage[document.getElementsByClassName("card_active")[0].classList[1]][selectedPrice];
        }
        ships[getShipID(e.target)][reciever][e.target.classList[1]] = document.getElementsByClassName("card_active")[0].classList[1]
      }

      break;
    case "shoot":
      let side = e.target.className;
      if(side == "sides") side = "port";
      ships[getShipID(e.target)].ammunition[document.getElementById("ammoSelect_" + getShipID(e.target)).value] -= ships[getShipID(e.target)].cannons[side].length/(side=="port"?ships[getShipID(e.target)].shipLength:1);
      document.getElementById("ammoShow_" + getShipID(e.target)).textContent = language.remaining + ": " + ships[getShipID(e.target)].ammunition[document.getElementById("ammoSelect_" + getShipID(e.target)).value];

      break;
    case "shareShip":
      let activeShip = ships[getShipID(e.target)];
      console.log(activeShip);
      encodeShip(activeShip).then((e) => console.log(e));
      encodeShip(activeShip).then((e) => alert(e));

      break;
    case "rotateMovementCanvas":
      drawMovementCanvas(e.target.parentElement.querySelector("#movementCanvas"), ships[getShipID(e.target)], e.target.innerText.split(" ")[1].split("°")[0]/90+1);
      console.log(JSON.parse(e.target.innerText.split(" ")[1].split("°")[0]) + 90);
      e.target.innerText = language.movement_points + " " + (JSON.parse(e.target.innerText.split(" ")[1].split("°")[0]) + 90)%360 + "° ⟳";
      break;
    case "changeMultiplier":
      multiplier = JSON.parse(e.target.className);
      break;
    case "ammoBuy":
      if(ships[e.target.className].ammunition.bullet_shot + ships[e.target.className].ammunition.lead_shot >= ships[e.target.className].maxAmmo) return;
      ships[e.target.className].ammunition[document.getElementById("ammoSelect_" + e.target.className).value]++;
      money-= ammunition[document.getElementById("ammoSelect_" + e.target.className).value].price;
      document.getElementById("ammoShow_" + e.target.className).innerText = language.remaining + ": " + ships[e.target.className].ammunition[document.getElementById("ammoSelect_" + e.target.className).value];
      break;
    case "price_high":
      selectedPrice = "expensive_price";
      document.getElementById("price_high").style.borderStyle = "solid";
      document.getElementById("price_medium").style.borderStyle = "none";
      document.getElementById("price_low").style.borderStyle = "none";

      break;
    case "price_medium":
      selectedPrice = "medium_price";
      document.getElementById("price_medium").style.borderStyle = "solid";
      document.getElementById("price_high").style.borderStyle = "none";
      document.getElementById("price_low").style.borderStyle = "none";
      break;
    case "price_low":
      selectedPrice = "cheap_price";
      document.getElementById("price_low").style.borderStyle = "solid";
      document.getElementById("price_medium").style.borderStyle = "none";
      document.getElementById("price_high").style.borderStyle = "none";
      break;
    default:
    document.getElementById("card_insert").style.display = "none";
    document.getElementById("price_choice").style.display = "none";
    document.getElementById("card_insert").innerHTML = "";
    try {document.getElementsByClassName("card_active")[0].classList.remove("card_active")} catch {}

  }
  document.cookie = JSON.stringify(ships) + "; sameSite=None; Secure"
})
document.addEventListener("change", (e) => {
  if(e.target.id.startsWith("ammoSelect_ship")){
    document.getElementById("ammoShow_ship_" + e.target.id.split("_")[2]).innerText = language.remaining + ": " + ships["ship_" + e.target.id.split("_")[2]].ammunition[e.target.value];
  }
});
function updateMainPage(){
  const buyPage = document.getElementById("buy_ship_page");
  buyPage.innerHTML = "";
  buyPage.appendChild(document.createElement("input"));
  buyPage.children[0].id = "shipName";
  buyPage.children[0].placeholder = language.ship + " 1";
  const shipSelection = document.createElement("select");
  buyPage.appendChild(shipSelection);
  shipSelection.id = "ship_type";
  shipSelection.appendChild(document.createElement("option"));
  shipSelection.children[0].innerHTML = language.selectShip;
  shipSelection.children[0].hidden = "true";
  shipSelection.children[0].disabled = "true";

  for(const ship in shipStartValue){
    let option = document.createElement("option");
    option.value = ship;
    option.innerHTML = language[ship];
    shipSelection.appendChild(option);
  }
  buyPage.appendChild(document.createElement("span"));
  buyPage.children[2].id = "buy_ship";
  buyPage.children[2].innerText = "Schiff Kaufen";
  buyPage.children[2].style = "user-select: none; cursor: pointer;";

  buyPage.appendChild(document.createElement("h2"));
  buyPage.children[3].innerText = language.currencies;
  buyPage.appendChild(document.createElement("div"));
  buyPage.children[4].innerText = language.money + ": ";
  buyPage.appendChild(adjustBuilder("money", money));
  buyPage.children[5].style.width="10%"
  buyPage.appendChild(document.createElement("ul"));
  let cumulativeResources = {};
  for(const ship of Object.values(ships)){
    let resources = {};
    const shipNameElement = document.createElement("li");
    buyPage.children[6].appendChild(shipNameElement);
    shipNameElement.innerText = ship.name;
    shipNameElement.appendChild(document.createElement("ul"));
    for(const item of ship.storage){
      resources[item]++;
      if(isNaN(resources[item])) resources[item] = 1;
      cumulativeResources[item]++;
      if(isNaN(cumulativeResources[item])) cumulativeResources[item] = 1;
    }
    delete resources.empty;
    for(const item of Object.keys(resources)){
      const innerList = document.createElement("li")
      shipNameElement.children[shipNameElement.children.length-1].appendChild(innerList);
      innerList.innerText = language[item] + ": " + resources[item];
    }

  }
  delete cumulativeResources.empty;
  if(Object.keys(cumulativeResources).length != 0) {
    const shipNameElement = document.createElement("li");
    buyPage.children[6].appendChild(shipNameElement);
    shipNameElement.innerText = language.cumulative;
    shipNameElement.appendChild(document.createElement("ul"));
    for(const item of Object.keys(cumulativeResources)){
      const innerList = document.createElement("li")
      shipNameElement.children[shipNameElement.children.length-1].appendChild(innerList);
      innerList.innerText = language[item] + ": " + cumulativeResources[item];
    }
  }
  buyPage.appendChild(document.createElement("button"));
  buyPage.children[buyPage.children.length-1].id = "changeMultiplier";
  buyPage.children[buyPage.children.length-1].innerText = "1x";
  buyPage.children[buyPage.children.length-1].classList = "1";

  buyPage.appendChild(document.createElement("button"));
  buyPage.children[buyPage.children.length-1].id = "changeMultiplier";
  buyPage.children[buyPage.children.length-1].innerText = "5x";
  buyPage.children[buyPage.children.length-1].classList = "5";

  buyPage.appendChild(document.createElement("button"));
  buyPage.children[buyPage.children.length-1].id = "changeMultiplier";
  buyPage.children[buyPage.children.length-1].innerText = "10x";
  buyPage.children[buyPage.children.length-1].classList = "10";
}

