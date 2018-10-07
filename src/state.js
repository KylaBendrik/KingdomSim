
const State = {
    currentMonth: 0,
    currentYear: 1,
    buildingChoice: undefined,
    houses: [],
    structures: [],

    findStructure(id) {
        return State.structures.find(structure => structure.structureNum === id)
    }
};

module.exports = State;