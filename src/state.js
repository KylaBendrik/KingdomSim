const State = {
  currentMonth: 0,
  currentYear: 1,
  buildingChoice: undefined,
  houses: [],
  peeps: [],
  marriages: [],
  structures: [],
  storages: [],
  buildingQueue: [],
  farmingQueue: [],
  map: [],
  wood: 0,
  maxWood: 0,
  food: 0,
  maxFood: 0,
  peepNum: 0,
  marriageNum: 0,
  randPeepMName: [
    'Adam', 'Aldus', 'Amis', 'Bate', 'Col', 'Daw', 'Dicun', 'Elis', 'Elric', 'Firmin', 'Hamon', 'Hankin', 'Hann', 'Herry', 'Hob', 'Hopkin', 'Hudde', 'Jackin', 'John', 'Jankin', 'Larkin', 'Law', 'Mack', 'Morris', 'Nichol', 'Noll', 'Ode', 'Pate', 'Randel', 'Roul', 'Tenney', 'Wilkin', 'Wilmot', 'Wybert', 'Wymond', 'Wyot',
    'Eudes', 'Garnier', 'Geoffroi', 'Gidie', 'Guarin', 'Jehan', 'Josse', 'Onfroi', 'Piers', 'Roland', 'Roul',
    'Tielo', 'Jurian', 'Bogdan', 'Bogumil', 'Borislav', 'Borisu'
  ],
  
  randPeepFName: [
    'Aldith', 'Aldreda', 'Amice', 'Diot', 'Dye', 'Eda', 'Isabel', 'Isolde', 'Malle', 'Matty', 'Meggy', 'Molle', 'Rohese', 'Rohesia', 'Stace',
    'Aalis', 'Amee', 'Cateline', 'Johanne', 'Melisende',
    'Elena', 'Lyudmila', 'Militsa'
  ],
  randPeepJob: [
    'farmer',
    'builder',
    'gatherer',
  ],

    // maptiles: {x, y, background, foreground, structureNum}
    // structures:{structureNum, type, originRow, originCol, pointsLeft, pointsStart}
    // houses: {houseNum, structure, peepSpots}
    // storages: {structure, maxWood, curWood, maxFood, curFood}
    // farmingQueue: {queueOrder, structure}
    // buildingQueue: {queueOrder, structure}
  findStorageForWood(storages) {
    //find storage with most open wood spots. Compare MaxWood to CurWood.
  },
  findSpouse(peep) {
    let marriageID = peep.marriageID;
    let spouse = undefined
    if (marriageID !== undefined){
      const index = State.peeps.findIndex(IDpeep => IDpeep.peepNum === peep.peepNum);
      for (var i = 0; i < State.peeps.length; i++){
        let tempPeep = State.peeps[i];
        if (tempPeep.marriageID === marriageID && i !== index){
          spouse = tempPeep;
        }
      }
    }
    
    return spouse;
  },
  addPeep(ageGroup, gender){
    const newPeep = { peepNum: undefined, name: undefined, gender: undefined,
      age: 0, birthMonth: undefined, birthYear: undefined, 
      father: undefined, mother: undefined, 
      marriageID: undefined, job: undefined, house: 0, 
      buildSkill: 0, 
      farmSkill: 0, 
      gatherSkill: 0 }
    //peepNum
    newPeep.peepNum = State.peepNum;
    //name and gender
    let genderNum = undefined
    if (gender === undefined){
      genderNum = Math.floor(Math.random() * 2);
      if (genderNum === 0){
        gender = 'male';
      } else {
        gender = 'female';
      }
    }
    if (gender === 'male'){
      newPeep.gender = 'male';
      newPeep.name = State.randPeepMName[Math.floor(Math.random() * State.randPeepMName.length)];
    } else {
      newPeep.gender = 'female';
      newPeep.name = State.randPeepFName[Math.floor(Math.random() * State.randPeepFName.length)];
    }

    if (ageGroup === 'adult'){
      //job
      newPeep.job = State.randPeepJob[Math.floor(Math.random() * State.randPeepJob.length)];
      //birthday and age
      newPeep.age = (Math.floor(Math.random() * 11) + 18);
      newPeep.birthMonth = Math.floor(Math.random() * 12);
      newPeep.birthYear = (State.currentYear - newPeep.age);
      
    }
    if (ageGroup === 'baby'){
      newPeep.age = 0
      newPeep.birthMonth = State.currentMonth;
      newPeep.birthYear = State.currentYear;
    }
    State.peepNum ++
    return newPeep;
  },
  findAvailableFamilies(){
    const families = [];
    //const houses = State.findAvailableHouses();
    for (const family of State.marriages){
      const mother = family.wife;
      //const house = mother.house;
      console.log ('family: ', family)
      if (family.pregCountdown <= 0){
        families.push(family);
      }
    }
    return families;
  },
  findEligibleCouple(){
    var couple = {husband: undefined, wife: undefined}
    var lookingH = true;
    var lookingW = true;
    var coupleFound = true;
    var hFather = undefined;
    var wFather = undefined;
    console.log ('looking for eligible couple')
    while (lookingH === true){
      for (const peep of State.peeps){
        if (peep.gender === 'male' && peep.marriageID === undefined && peep.age > 17){
          console.log ('found a man')
          couple.husband = peep;
          hFather = peep.father;
          lookingH = false
        }
      }
      if (lookingH === true){
        console.log ('could not find man, quitting.')
        lookingH = false;
        coupleFound = false;
      }
    }

    while (lookingW === true && coupleFound === true){
      for (const peep of State.peeps){
        wFather = peep.father;
        if (peep.gender === 'female' && peep.marriageID === undefined && peep.age > 17){
          if (hFather === undefined){
            console.log ('found a woman')
            couple.wife = peep;
            lookingW = false
          } else if (hFather !== wFather){
            console.log ('found a woman')
            couple.wife = peep;
            lookingW = false
          }
        }
      }
      if (lookingW === true){
        console.log ('could not find woman, quitting')
        lookingW = false;
        coupleFound = false;
      }
    }

    if (coupleFound === true){
      console.log ('found couple: ', couple.husband.name, ' and ', couple.wife.name)
      return couple;
    } else {
      console.log ('unsucessful. returning undefined')
      return undefined;
    }
    
  },
  findEmptyHouses() {
    const emptyHouses = [];
    for (const house of State.houses) {
      const peepsInHouse = State.peepsInHouse(house);
      if (peepsInHouse === 0) {
        emptyHouses.push(house);
      }
    }
    return emptyHouses;
  },
  findAvailableHouses() {
    const availableHouses = [];
    for (const house of State.houses) {
      const peepsInHouse = State.peepsInHouse(house);
      if (peepsInHouse < house.peepSpots) {
        availableHouses.push(house);
      }
    }
    return availableHouses;
  },
  peepsInHouse(house) {
    let peepsInHouse = 0;
    for (const peep of State.peeps) {
      if (peep.house === house.houseNum) {
        peepsInHouse++;
      }
    }
    return peepsInHouse;
  },
  countPeepSpots() {
    let peepSpots = 0;
    for (const house of State.houses) {
      peepSpots += house.peepSpots;
    }
    return peepSpots;
  },
  removeStructure(id) {
    const index = State.structures.findIndex(structure => structure.structureNum === id);

    State.structures.splice(index, 1);
  },
  findStorage(structure) {
    return State.storages.find(storage => storage.structure === structure);
  },

  findStructure(id) {
    return State.structures.find(structure => structure.structureNum === id);
  },

  findStructurebyHouse(houseNum) {
    const structureNum = State.findHouseByHouse(houseNum).structure;
    return State.structures.find(structure => structure.structureNum === structureNum);
  },

  findHouseByHouse(houseNum) {
    return State.houses.find(house => house.houseNum === houseNum);
  },

  findHouse(structureNum) {
    return State.houses.find(house => house.structure === structureNum);
  },

  findQueueOrder(structureNum) {
    return State.buildingQueue.find(structure => structure.structure === structureNum);
  },
  findFarmQueueOrder(structureNum) {
    return State.farmingQueue.find(structure => structure.structure === structureNum);
  },

  findPeepsByHouse(houseNum) {
    let foundPeeps = [],
      i = -1;
    for (i = 0; i < State.peeps.length; i++) {
      if (State.peeps[i].house === houseNum) {
        foundPeeps.push(State.peeps[i]);
      }
    }
    return foundPeeps;
  },

  findPeepsByJob(job) {
    let foundPeeps = [],
      i = -1;
    for (i = 0; i < State.peeps.length; i++) {
      if (State.peeps[i].job === job) {
        foundPeeps.push(State.peeps[i]);
      }
    }
    return foundPeeps;
  },
};

module.exports = State;
