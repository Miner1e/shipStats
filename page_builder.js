import {read} from "./util.js";
let shipStartValue = await read("./config/stats/ships.json");

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
    slot.appendChild(document.createElement("table"));
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
    adjustRow.children[2].textContent = "+";
  });
  leftSide.appendChild(document.createElement("h2"));
  leftSide.children[leftSide.children.length-1].textContent = language.cannons;  

  leftSide.appendChild(document.createElement("table"));
  leftSide.children[leftSide.children.length-1].className = "hull";
  
  let cannonList = document.createElement("tr");
  leftSide.children[leftSide.children.length-1].appendChild(cannonList);
  cannonList.style = "height: 100%; text-align: center";
  cannonList.classList = "cannons";


  for(let spot in data.cannons){
    cannonList.appendChild(document.createElement("td"));
    cannonList.children[cannonList.children.length-1].style = "width: 1%";
    data.cannons[spot].forEach((cannon, i) => {
      cannonList.appendChild(document.createElement("td"));
      cannonList.children[cannonList.children.length-1].style = "width: " + 97/data.cannons.length + "%;";
      let cannonImage = document.createElement("img");
      cannonList.children[cannonList.children.length-1].appendChild(cannonImage);
      cannonImage.id = "card_slot";
      cannonImage.className = "card_slot " + spot + "_" + (i + 1);
      cannonImage.src = "./pictures/cards/cannons/empty.png";
      cannonImage.style.width = "100%";
    });
  }
  rightSide.appendChild(document.createElement("h2"));
  rightSide.children[rightSide.children.length-1].textContent = language.storage;
  rightSide.appendChild(document.createElement("table"));
  rightSide.children[rightSide.children.length-1].className = "hull";
  
  let supplyList = document.createElement("tr");
  rightSide.children[rightSide.children.length-1].appendChild(supplyList);
  supplyList.style = "height: 100%; text-align: center";
  supplyList.classList = "storage";

  for(let spot in data.storage){
    supplyList.appendChild(document.createElement("td"));
    supplyList.children[supplyList.children.length-1].style = "width: " + 100/data.storage.length + "%;";
    let itemImage = document.createElement("img");
    supplyList.children[supplyList.children.length-1].appendChild(itemImage);
    itemImage.id = "card_slot";
    itemImage.className = "card_slot " + spot;
    itemImage.src = "./pictures/cards/cannons/empty.png";
    itemImage.style.width = "100%";

  }

  rightSide.appendChild(document.createElement("h2"));
  rightSide.children[rightSide.children.length-1].textContent = language.crew;
  rightSide.appendChild(document.createElement("table"));
  rightSide.children[rightSide.children.length-1].className = "hull";
  
  let crewList = document.createElement("tr");
  rightSide.children[rightSide.children.length-1].appendChild(crewList);
  crewList.style = "height: 100%; text-align: center";
  crewList.classList = "crew";

  for(let spot in data.crew){
    crewList.appendChild(document.createElement("td"));
    crewList.children[crewList.children.length-1].style = "width: " + 100/data.crew.length + "%;";
    let itemImage = document.createElement("img");
    crewList.children[crewList.children.length-1].appendChild(itemImage);
    itemImage.id = "card_slot";
    itemImage.className = "card_slot " + spot;
    itemImage.src = "./pictures/cards/cannons/empty.png";
    itemImage.style.width = "100%";

  }


  html += `
    <div id="ship_` + shipCount + `" class="ship_stats">
    <div style="width:50%">
  `
  Object.keys(data).forEach((item, i) => {
    if(item == "hull" || item == "penetration"){
      html += `
        <h2>` + language[item] + `</h2>
        <table class="hull">
        <tr style="height: 50%; text-align: center">
      `
      Object.keys(data[item]).forEach((stat, i) => {
        html += `
          <td class="hull_elements">` + language[Object.keys(data[item])[i]] + `</td>
        `
      })
      html += `
        </tr>
        <tr style="height: 50%">
      `
      Object.keys(data[item]).forEach((stat, i) => {
        html += `
          <td class="hull_elements">
            <table class="values_table ` + item + `_`+ stat + `">
              <tr class="values_table_row">
                  <td id="minus" class="values" style="cursor:  url('./pictures/cursors/minus.png'), pointer;;">-</td>
                  <td class="values" style="border: solid #726454; width: 50%;">` + data[item][stat] + `</td>
                  <td id="plus" class="values" style="cursor:  url('./pictures/cursors/plus.png'), pointer;;">+</td>
              </tr>
            </table>
          </td>

        `
      });
      html += `
        </tr>
        </table>
      `
    } else if(item == "cannons") {
      html += `
      <h2>` + language[item] + `</h2>
      <table class="hull">
      <tr style="height: 100%; text-align: center">
      `
      for(let spot in data.cannons){
        html += `<td style="width: 1%"></td>`;
        data.cannons[spot].forEach((cannon, i) => {
          html += `
          <td style="width: ` + 97/data[item].length + `%;"><img id="card_slot" class="card_slot ` + spot + `_` + (i + 1) + `" src="./pictures/cards/cannons/empty.png" width="100%"></td>
          `
        });
      }

      html += `
      </tr>
      </table>
      `
    }
  });
  html += `
    </div>
    </div>
  `
  return shipPage;
}










export { page_builder }
