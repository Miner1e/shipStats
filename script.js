import {page_builder} from "./page_builder.js";
import {read} from "./util.js";

let selectedLanguage = "german"
let shipStartValue = await read("./config/stats/ships.json");
let cannons = await read("./config/stats/cannons.json");
let storage = await read("./config/stats/storage.json");
let crew = await read("./config/stats/crew.json");
let language = await read("./config/language/" + selectedLanguage + ".json");


const buyPage = document.getElementById("buy_ship_page");
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





//global variables
let money = 100;
let shipCount = 1;
let ships = {}

document.addEventListener("load", async function(e){
  ships = document.cookie
  if(typeof ships != Object) ships = {};
})
document.addEventListener("click", function (e){
  console.log(money);
  switch (e.target.id) {
    case "ship_select_tab":
      if(!e.target.className.includes("ship_select_tab")) return;
      document.getElementsByClassName("ship_select_tab_active")[0].classList.remove("ship_select_tab_active");
      e.target.classList.add("ship_select_tab_active");
      try{document.getElementsByClassName("ship_stats_active")[0].classList.remove("ship_stats_active");} catch{};
      document.getElementById(e.target.classList[0]).classList.add("ship_stats_active");
      break;
    case "buy_ship":
      if(money < 20) return;
      let value = document.getElementById("ship_type").value
      if(document.getElementById("ship_type").value == "") return;
      let name = document.getElementById("shipName").value;
      if(name == "") name = language.ship + " " + shipCount;
      document.getElementById("shipName").placeholder = language.ship + " " + (shipCount + 1);
      console.log("name");
      document.getElementById("ship_select_body").innerHTML += "<td id='ship_select_tab' class='ship_" + shipCount + " ship_select_tab'>"+ name + " (" + language[document.getElementById("ship_type").value] + ")</td>";
      document.getElementById("ship_stats_body").appendChild(page_builder(value, language, shipCount));
      //document.getElementById("ship_stats_body").innerHTML = page_builder(value, language, shipCount);
      ships["ship_" + shipCount] = structuredClone(shipStartValue[value])
      shipCount++;
      money -= 20;
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
      let increase = 1;
      if(e.shiftKey) increase *= 5;
      if(e.ctrlKey) increase *= 10;
      ships[document.getElementsByClassName("ship_stats_active")[0].id][e.target.parentElement.parentElement.classList[1].split("_")[0]][e.target.parentElement.parentElement.classList[1].split("_")[1]] += (e.target.id == "plus" ? increase : (increase*-1))
      e.target.parentElement.children[1].innerHTML = ships[document.getElementsByClassName("ship_stats_active")[0].id][e.target.parentElement.parentElement.classList[1].split("_")[0]][e.target.parentElement.parentElement.classList[1].split("_")[1]]
      break;
    case "card_slot":
      if(document.getElementById("card_insert").style.display != "block"){
        const reciever = e.target.parentElement.parentElement.className.split(" ")[0];
        let pool = cannons;
        if(reciever == "storage") pool = storage;
        if(reciever == "crew") pool = crew;

        let selection = document.getElementById("card_insert");
        selection.style.display = "block";
        for(const item in pool){
          let img = document.createElement("img");
          img.src = "./pictures/cards/" + reciever + "/" + item + ".png";
          img.id = "card";
          img.classList.add("card");
          img.classList.add(item);
          selection.appendChild(img);
        }
      } else if (document.getElementsByClassName("card_active").length != 0) {
        e.target.src = document.getElementsByClassName("card_active")[0].src;
        const reciever = e.target.parentElement.parentElement.className.split(" ")[0];
        if(reciever == "cannons"){
          ships[getShipID(e.target)].cannons[e.target.classList[1].split("_")[0]][e.target.classList[1].split("_")[1]-1] = document.getElementsByClassName("card_active")[0].classList[1]
          console.log(ships);
          return;
        }
        ships[getShipID(e.target)][reciever][e.target.classList[1]] = document.getElementsByClassName("card_active")[0].classList[1]
        console.log(ships);
      }

      break;
    default:
    document.getElementById("card_insert").style.display = "none";
    document.getElementById("card_insert").innerHTML = "";
    try {document.getElementsByClassName("card_active")[0].classList.remove("card_active")} catch {}

  }
  document.cookie = JSON.stringify(ships) + "; sameSite=None; Secure"
})
function getShipID(element) {
  while (![...element.classList].includes("ship_stats")) {
    element = element.parentElement
  }
  return element.id
}
