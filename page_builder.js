function page_builder (shipType, selectedLanguage, shipCount) {
  let data = shipStartValue[shipType]
  console.log(shipType);
  let html = ""
/*  <div id="ship_1" class="ship_stats">

    <h2>` + language[selectedLanguage].wallThickness + `</h2>
    <table class="hull">
      <tr style="height: 50%">
          <td class="hull_elements">Gesamt</td>
          <td class="hull_elements">Bug</td>
          <td class="hull_elements">Heck</td>
          <td class="hull_elements">Steuerbord</td>
          <td class="hull_elements">Backbord</td>
      </tr>
      <tr style="height: 50%">
    `
      for (var i = 0; i < 5; i++) {
        html += `
          <td class="hull_elements">
            <table class="values_table">
              <tr class="values_table_row">
                  <td id="minus" class="values" style="cursor:  url('./pictures/cursors/minus.png'), pointer;;">-</td>
                  <td class="values" style="border: solid #726454; width: 50%;">9999</td>
                  <td id="plus" class="values" style="cursor:  url('./pictures/cursors/plus.png'), pointer;;">+</td>
              </tr>
            </table>
          </td>

        `
      }
      html += `
        </tr>
        </table>
        <h2>` + language[selectedLanguage].penitration + `</h2>
        <table class="hull">
          <tr style="height: 50%">
              <td class="hull_elements">Bug</td>
              <td class="hull_elements">Heck</td>
              <td class="hull_elements">Steuerbord</td>
              <td class="hull_elements">Backbord</td>
          </tr>
          <tr style="height: 50%">
      `
      for (var i = 0; i < 4; i++) {
        html += `
          <td class="hull_elements">
            <table class="values_table">
              <tr class="values_table_row">
                  <td id="minus" class="values" style="cursor:  url('./pictures/cursors/minus.png'), pointer;;">-</td>
                  <td class="values" style="border: solid #726454; width: 50%;">9999</td>
                  <td id="plus" class="values" style="cursor:  url('./pictures/cursors/plus.png'), pointer;;">+</td>
              </tr>
            </table>
          </td>

        `
      }
      html += `
        </tr>
        </table>
      `
  */
  html += `
    <div id="ship_` + shipCount + `" class="ship_stats">
    <div style="width:50%">
  `
  Object.keys(data).forEach((item, i) => {
    if(item == "hull" || item == "penetration"){
      html += `
        <h2>` + language[selectedLanguage][item] + `</h2>
        <table class="hull">
        <tr style="height: 50%; text-align: center">
      `
      Object.keys(data[item]).forEach((stat, i) => {
        html += `
          <td class="hull_elements">` + language[selectedLanguage][Object.keys(data[item])[i]] + `</td>
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
    } else if (item == "cannons") {
      html += `
      <h2>` + language[selectedLanguage][item] + `</h2>
      <table class="hull">
      <tr style="height: 100%; text-align: center">
      `
      data[item].forEach((cannon, i) => {
        html += `
        <td style="width: ` + 100/data[item].length + `%;"><img id="card_slot" class="card_slot ` + (i + 1) + `" src="./pictures/cards/cannons/empty.png" width="100%"></td>
        `
      });
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
  return html;
}








const shipDef = {
  merchant_pinnance: {
    max_stats: {
      hull: {
        total: 160,
        bug: 145,
        rear: 145,
        starbord: 145,
        larboard: 135,
      },
      penetration: {
        bug: 5,
        rear: 5,
        starbord: 10,
        larboard: 10,
      },
      storage: 54,
      resources: {
        wood: 72,
        sails: 33,
        iron: 12,
        other: 6,
      }
    }
  }
};
const shipStartValue = {
  merchant_pinnance: {
      hull: {
        total: 80,
        bug: 65,
        rear: 65,
        starbord: 65,
        larboard: 65,
      },
      penetration: {
        bug: 0,
        rear: 0,
        starbord: 0,
        larboard: 0,
      },
      storage: {
        content: [

        ],
        value: 0,
      },
      resources: {
        wood: 0,
        sails: 0,
        iron: 0,
        other: 0,
        ammunitionBullet: 0,
        buckshot: 0,
        food: 0,
        crew: 0,
      },
      cannons: [
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ]
  }
}
const language = {
  german: {
    merchant_pinnance: "Handelsspinassschiff",
    brigantine: "Brigantine",
    frigate: "Fregatte",
    galleon: "Galeone",
    cannon_brigantine: "Kanonenbrigantine",
    war_pinnance_big: "Kriegsspinasse groß",
    war_pinnance_small: "Kriegsspinasse klein",

    hull: "Wandstärke",
    penetration: "Durchschlagskraft",
    total: "Gesamt",
    bug: "Bug",
    rear: "Heck",
    starbord: "Steuerbord",
    larboard: "Backbord",
    cannons: "Kanonen",
  },
  english: {
    merchant_pinnance: "Handelsspinassschiff",
    brigantine: "Brigantine",
    frigate: "Fregatte",
    galleon: "Galeone",
    cannon_brigantine: "Kanonenbrigantine",
    war_pinnance_big: "Kriegsspinasse groß",
    war_pinnance_small: "Kriegsspinasse klein",

    hull: "Wall thickness",
    penetration: "Penetration",
    total: "Total",
    bug: "Bug",
    rear: "Rear",
    starbord: "Starboard",
    larboard: "Larboard",
    cannons: "Cannons",

  }
}
export { shipDef, language, page_builder, shipStartValue }
