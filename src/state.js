
const State = {
    currentMonth: 0,
    currentYear: 1,
    buildingChoice: undefined,
    houses: [],
    peeps: [],
    structures: [],
    buildingQueue: [],
    wood: 50,

    findStructure(id) {
        return State.structures.find(structure => structure.structureNum === id)
    },

    findHouse(structureNum){
        return State.houses.find(house => house.structure === structureNum)
    },

    findPeepsByHouse(houseNum){
        var foundPeeps = [], i = -1;
        for(i=0; i < State.peeps.length; i++){
            if (State.peeps[i].house === houseNum){
                foundPeeps.push(State.peeps[i]);
            }
        }
        return foundPeeps;
    },

    findPeepsByJob(job){
        var foundPeeps = [], i = -1;
        for(i=0; i < State.peeps.length; i++){
            if (State.peeps[i].job === job){
                foundPeeps.push(State.peeps[i]);
            }
        }
        return foundPeeps;
    }
};

module.exports = State;