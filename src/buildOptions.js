const State = require('./state');

const BuildOptions = {
    init(houseButton, farmButton, stockpileWButton, smallBarnButton) {
        houseButton.addEventListener('click', BuildOptions.chooseHouse);
        farmButton.addEventListener('click', BuildOptions.chooseFarm);
        stockpileWButton.addEventListener('click', BuildOptions.chooseStockpileW);
        smallBarnButton.addEventListener('click', BuildOptions.chooseSmallBarn);
    },

    chooseHouse() {
        console.log("clicked 'house'");
        State.buildingChoice = {type: 'house1', rows: 2, cols: 2};
    },

    chooseFarm() {
        console.log("clicked 'farmland'");
        State.buildingChoice = {type: 'farmland_empty', rows: 2, cols: 2};
    },
    chooseStockpileW() {
        console.log("clicked 'wood stockpile'");
        State.buildingChoice = {type: 'stockpileW_con', rows: 2, cols: 2};
    },
    chooseSmallBarn() {
        console.log("clicked 'small barn'");
        State.buildingChoice = {type: 'smallBarn_con', rows: 2, cols: 2};
    }
}



module.exports = BuildOptions;