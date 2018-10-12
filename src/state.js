const State = {
    currentMonth: 0,
    currentYear: 1,
    buildingChoice: undefined,
    houses: [],
    peeps: [],
    structures: [],
    storages: [],
    buildingQueue: [],
    farmingQueue: [],
    map: [],
    wood: 0,
    maxWood: 0,
    food: 0,
    maxFood: 0,

    //will get rid of later. Temporary...
    randPeeps: [
        {name: 'Andrew', job: 'farmer', house: 0, buildSkill: 0, farmSkill: 0, gatherSkill: 0, age: 20}, 
        {name: 'Anna', job: 'farmer', house: 0, buildSkill: 0, farmSkill: 0, gatherSkill: 0, age: 20}, 
        {name: 'Burt', job: 'builder', house: 0, buildSkill: 0, farmSkill: 0, gatherSkill: 0, age: 20}, 
        {name: 'Barbara', job: 'builder', house: 0, buildSkill: 0, farmSkill: 0, gatherSkill: 0, age: 20},
        {name: 'Charles', job: 'farmer', house: 0, buildSkill: 0, farmSkill: 0, gatherSkill: 0, age: 20}, 
        {name: 'Catherine', job: 'farmer', house: 0, buildSkill: 0, farmSkill: 0, gatherSkill: 0, age: 20}, 
        {name: 'Daniel', job: 'gatherer', house: 0, buildSkill: 0, farmSkill: 0, gatherSkill: 0, age: 20}, 
        {name: 'Danielle', job: 'gatherer', house: 0, buildSkill: 0, farmSkill: 0, gatherSkill: 0, age: 20} 
    ],

    // maptiles: {x, y, background, foreground, structureNum}
    // structures:{structureNum, type, originRow, originCol, pointsLeft, pointsStart}
    // houses: {houseNum, structure, peepSpots}
    // farmingQueue: {queueOrder, structure}
    // buildingQueue: {queueOrder, structure}
    findEmptyHouses(){
        const emptyHouses = []
        for (house of State.houses){
            const peepsInHouse = State.peepsInHouse();
            if (peepsInHouse === 0){
                emptyHouses.push(house);
            }
        }
        return emptyHouses;
    },
    findAvailableHouses(){
        const availableHouses = [];
        for (house of State.houses){
            const peepsInHouse = State.peepsInHouse();
            console.log ('peeps in house', house.houseNum, ': ', peepsInHouse);
            if (peepsInHouse < house.peepSpots){
                availableHouses.push(house)
            }
        }
        return availableHouses;
    },
    peepsInHouse(){
        var peepsInHouse = 0;
            for (peep of State.peeps){
                if (peep.house === house.houseNum){
                    peepsInHouse ++;
                }
            }
        return peepsInHouse;
    },
    countPeepSpots(){
        var peepSpots = 0;
        for (house of State.houses){
            peepSpots += house.peepSpots;
        }
        return peepSpots;
    },
    removeStructure(id){
        const index = State.structures.findIndex(structure => structure.structureNum === id);

        State.structures.splice(index, 1);
    },
    findStorage(structure) {
        return State.storages.find(storage => storage.structure === structure)
    },

    findStructure(id) {
        return State.structures.find(structure => structure.structureNum === id)
    },

    findStructurebyHouse(houseNum) {
        structureNum = State.findHouseByHouse(houseNum).structure;
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