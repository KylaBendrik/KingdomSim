const State = {
    currentMonth: 0,
    currentYear: 1,
    buildingChoice: undefined,
    houses: [],
    peeps: [],
    structures: [],
    buildingQueue: [],
    farmingQueue: [],
    map: [],
    wood: 50,
    food: 50,

    removeStructure(id){
        const index = State.structures.findIndex(structure => structure.structureNum === id);

        State.structures.splice(index, 1);
    },

    findStructure(id) {
        return State.structures.find(structure => structure.structureNum === id)
    },

    findStructurebyHouse(houseNum) {
        structureNum = State.findHouseByHouse(houseNum).structure;
        console.log (structureNum);
        return State.structures.find(structure => structure.structureNum === structureNum)
    },

    findHouseByHouse(houseNum) {
        return State.houses.find(house => house.houseNum === houseNum)
    },

    findHouse(structureNum){
        return State.houses.find(house => house.structure === structureNum)
    },

    findQueueOrder(structureNum){
        return State.buildingQueue.find(structure => structure.structure === structureNum)
    },
    findFarmQueueOrder(structureNum){
        return State.farmingQueue.find(structure => structure.structure === structureNum)
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