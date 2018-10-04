const State = require('./state');

const BuildOptions = {
    init(houseButton, farmButton) {
        houseButton.addEventListener('click', BuildOptions.chooseHouse);
        farmButton.addEventListener('click', BuildOptions.chooseFarm);
    },

    chooseHouse() {
        console.log("clicked 'house");
        State.buildingChoice = 'house1';
    },

    chooseFarm() {
        console.log("clicked 'farmland");
        State.buildingChoice = 'farmland';
    }
}

module.exports = BuildOptions;