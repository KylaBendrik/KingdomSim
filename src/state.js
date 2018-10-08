
const State = {
    currentMonth: 0,
    currentYear: 1,
    buildingChoice: undefined,
    houses: [],
    peeps: [],
    structures: [],

    findStructure(id) {
        return State.structures.find(structure => structure.structureNum === id)
    },

    findHouse(structureNum){
        return State.houses.find(house => house.structure === structureNum)
    },

    findPeep(houseNum){
        return State.peeps.find(peep => peep.house === houseNum)
    }
};

module.exports = State;