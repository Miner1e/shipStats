import {language, page_builder, shipStartValue} from "./page_builder.js";
//global variables
let selectedLanguage = "german"
let money = 100;
let shipCount = 1;
let ships = {}
//click Events
window.addEventListener("load", function(e){
  ships = document.cookie
  if(typeof ships != Object) ships = {};
})
document.addEventListener("click", function (e){
  //console.log(e.target.id);
  switch (e.target.id) {
    case "ship_select_tab":
      if(!e.target.className.includes("ship_select_tab")) return;
      document.getElementsByClassName("ship_select_tab_active")[0].classList.remove("ship_select_tab_active");
      e.target.classList.add("ship_select_tab_active");
      document.getElementsByClassName("ship_stats_active")[0].classList.remove("ship_stats_active");
      document.getElementById(e.target.classList[0]).classList.add("ship_stats_active");
      break;
    case "buy_ship":
      if(money < 20) return;
      let value = document.getElementById("ship_type").value
      if(document.getElementById("ship_type").value == "") return;
      document.getElementById("ship_select_body").innerHTML += "<td id='ship_select_tab' class='ship_" + shipCount + " ship_select_tab'>Schiff" + shipCount + " (" + language[selectedLanguage][document.getElementById("ship_type").value] + ")</td>";
      document.getElementById("ship_stats_body").innerHTML += page_builder(value, selectedLanguage, shipCount);
      ships["ship_" + shipCount] = shipStartValue[value]
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
      if(e.shiftKey) increase = 5;
      if(e.ctrlKey) increase = 10;
      ships[document.getElementsByClassName("ship_stats_active")[0].id][e.target.parentElement.parentElement.parentElement.classList[1].split("_")[0]][e.target.parentElement.parentElement.parentElement.classList[1].split("_")[1]] += (e.target.id == "plus" ? increase : (increase*-1))
      e.target.parentElement.children[1].innerHTML = ships[document.getElementsByClassName("ship_stats_active")[0].id][e.target.parentElement.parentElement.parentElement.classList[1].split("_")[0]][e.target.parentElement.parentElement.parentElement.classList[1].split("_")[1]]
      break;
    case "card_slot":
      if(document.getElementById("card_insert").style.display != "block"){
        document.getElementById("card_insert").style.display = "block";
      } else if (document.getElementsByClassName("card_active").length != 0) {
        e.target.src = "./pictures/cards/cannons/cannon_exmpl.png"
        ships[getShipID(e.target)].cannons[e.target.classList[1] - 1] = document.getElementsByClassName("card_active")[0].classList[1]
      }

      break;
    default:
    document.getElementById("card_insert").style.display = "none";
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
