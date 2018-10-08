const State = {
    currentMonth: 0,
    currentYear: 1,
    buildingChoice: undefined,
    houses: [],
    peeps: [],
    structures: [],
    buildingQueue: [],
    map: [],
    wood: 50,

    findStructure(id) {
        return State.structures.find(structure => structure.structureNum === id)
    },

    findStructurebyHouse(id) {
        structureNum = State.findHouseByHouse.structure;
        return State.structures.find(structure => structure.structureNum === id)
    },

    findHouseByHouse(houseNum) {
        console.log ('find house by house')
        console.log(State.houses.find(house => house.houseNum === houseNum))
        return State.houses.find(house => house.houseNum === houseNum)
    },

    findHouse(structureNum){
        return State.houses.find(house => house.structure === structureNum)
    },

    findQueueOrder(structureNum){
        return State.buildingQueue.find(structure => structure.structure === structureNum)
    },

    findMapCoordsByHouse(houseNum) {
        console.log ('find map by house')
        structureNum = State.findHouseByHouse(houseNum).structure;
        console.log (structureNum);
        console.log (State.map);
        console.log(State.map.find(structure => structure.structure === structureNum));
        return State.map.find(structure => structure.structure === structureNum);
    },

    findMapCoords(structureNum){
        return State.map.find(structure => structure.structure === structureNum)
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