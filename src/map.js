const loadTextures = require('./textures');
const State = require('./state');

const range = function range(n) {
  return [...Array(n).keys()];
};

// initialize

State.peeps.push(
    { name: 'Adam', gender: 'male', marriageID: 0, job: 'builder', house: 0, buildSkill: 0, farmSkill: 0, gatherSkill: 0, age: 20, birthMonth: 0, birthYear: -20 },
    { name: 'Eve', gender: 'female', marriageID: 0, job: 'gatherer', house: 0, buildSkill: 0, farmSkill: 0, gatherSkill: 0, age: 20, birthMonth: 0, birthYear: -20 },
    { name: 'Bob', gender: 'male', marriageID: 1, job: 'farmer', house: 1, buildSkill: 0, farmSkill: 0, gatherSkill: 0, age: 20, birthMonth: 0, birthYear: -20 },
    { name: 'Martha', gender: 'female', marriageID: 1, job: 'farmer', house: 1, buildSkill: 0, farmSkill: 0, gatherSkill: 0, age: 20, birthMonth: 0, birthYear: -20 },
);


// map stuff

const map = State.map;
const NUM_ROWS = 24;
const NUM_COLS = 40;
let houseNum = 0;
let structureNum = 0;
let queueOrder = 0;
let farmQueueOrder = 0;

// making the map randomly
for (let y = 0; y < NUM_ROWS; y++) {
  const newLine = [];

  for (let x = 0; x < NUM_COLS; x++) {
    const ifTree = Math.floor(Math.random() * 7);
    if (ifTree === 0) {
      newLine.push({ x, y, background: 'grass1', foreground: 'tree1', structureNum });
      State.structures.push({ structureNum, type: 'tree', originRow: y, originCol: x, pointsLeft: 1, pointsStart: 0 });
      structureNum++;
    } else if (ifTree === 1) {
      newLine.push({ x, y, background: 'grass2', foreground: 'tree2', structureNum });
      State.structures.push({ structureNum, type: 'tree', originRow: y, originCol: x, pointsLeft: 2, pointsStart: 0 });
      structureNum++;
    } else if (ifTree === 2) {
      newLine.push({ x, y, background: 'grass3', foreground: 'tree3', structureNum });
      State.structures.push({ structureNum, type: 'tree', originRow: y, originCol: x, pointsLeft: 3, pointsStart: 0 });
      structureNum++;
    } else if (ifTree === 3) {
      newLine.push({ x, y, background: 'grass4', foreground: 'tree0', structureNum });
      State.structures.push({ structureNum, type: 'sapling', originRow: y, originCol: x, pointsLeft: 0, pointsStart: 0 });
      structureNum++;
    } else {
      newLine.push({ x, y, background: 'grass2', foreground: 'nothing', structureNum: undefined });
    }
  }

  map.push(newLine);
}

// resources - probably a better spot

document.addEventListener('DOMContentLoaded', () => {
  MapUtil.setWoodText(State.wood, State.maxWood);
  MapUtil.setFoodText(State.food);
});


// adding default houses
const MapUtil = {
  setWoodText(wood, maxWood) {
        // `./textures/village_map/map/${path}.png`
    document.getElementById('wood').innerHTML = `${State.wood}/${State.maxWood}`;
  },
  setFoodText(food) {
    document.getElementById('food').innerHTML = `${State.food}/${State.maxFood}`;
  },
  addStructure(tiles, texture, structureNum) {
    const [origin, ...rest] = tiles;
    origin.foreground = texture;

    for (const tile of rest) {
      tile.foreground = 'structure';
    }
    for (const tile of tiles) {
      if (tile.structureNum !== undefined) {
        State.removeStructure(tile.structureNum);
      }
      tile.structureNum = structureNum;
    }
  },
  newTiles(rows, cols, row, col) {
    let R = 0;
    const tiles = [];
    while (R < rows) {
      let C = 0;
      while (C < cols) {
        tiles.push(map[row + R][col + C]);
        C++;
      }
      R++;
    }
    return tiles;
  },
  addMountain1_0(row, col) {
    const rows = 8;
    const cols = 16;
    const tiles = MapUtil.newTiles(rows, cols, row, col);

    MapUtil.addStructure(tiles, 'mountain1_0', structureNum);

    State.structures.push({ structureNum, type: 'mountain1_0', originRow: row, originCol: col, pointsLeft: 0, pointsStart: 20 });

    structureNum++;
  },
  addHouse1_complete(row, col) {
    const tiles = [
      map[row][col],
      map[row][col + 1],
      map[row + 1][col],
      map[row + 1][col + 1],
    ];

    const maxWood = 5;
    const maxFood = 25;
    const peepSpots = 4;

    MapUtil.addStructure(tiles, 'house1', structureNum);

    State.houses.push({ houseNum, structure: structureNum, peepSpots });
    State.structures.push({ structureNum, type: 'house1', originRow: row, originCol: col, pointsLeft: 0, pointsStart: 20 });
    State.storages.push({ structure: structureNum, maxWood, curWood: maxWood, maxFood, curFood: maxFood });

    State.maxWood += maxWood;
    State.maxFood += maxFood;
    State.wood += maxWood;
    State.food += maxFood;
    houseNum++;
    structureNum++;
  },
  addHouse1(row, col) {
    let points = 20;
    let woodRequired = 40;

    const tiles = [
      map[row][col],
      map[row][col + 1],
      map[row + 1][col],
      map[row + 1][col + 1],
    ];

    const structureList = tiles.map(tile => State.findStructure(tile.structureNum));

    for (const structure of structureList) {
      if (structure !== undefined && structure.type === 'tree') {
        points += 5;
        woodRequired -= 2;
      }
    }
    if (State.wood >= woodRequired) {
      MapUtil.addStructure(tiles, 'house1_con', structureNum);

      State.structures.push({ structureNum, type: 'house1_con', originRow: row, originCol: col, pointsLeft: points, pointsStart: points });
      State.buildingQueue.push({ queueOrder, structure: structureNum });


      queueOrder++;
      structureNum++;
      State.wood -= woodRequired;
      MapUtil.setWoodText(State.wood, State.maxWood);
    }
  },
  addFarmland_empty(row, col) {
    console.log('-------------------');
    console.log('adding new farmland');
    const points = 0;

    const tiles = [
      map[row][col],
      map[row][col + 1],
      map[row + 1][col],
      map[row + 1][col + 1],
    ];

    const isNothing = tile => tile.foreground === 'nothing';

    if (tiles.every(isNothing)) {
      MapUtil.addStructure(tiles, 'farmland_empty', structureNum);

      State.structures.push({ structureNum, type: 'farmland_empty', originRow: row, originCol: col, pointsLeft: points, pointsStart: points });
      console.log('new farmland placed. Structure: ', structureNum);
      console.log('structures:', State.structures);
      console.log('trying really hard to find structure in list:', State.findStructure(structureNum));
      State.farmingQueue.push({ queueOrder: farmQueueOrder, structure: structureNum });

      farmQueueOrder++;
      structureNum++;
    }
  },
  addStockpileW(row, col) {
    let points = 10;
    let woodRequired = 10;

    const tiles = [
      map[row][col],
      map[row][col + 1],
      map[row + 1][col],
      map[row + 1][col + 1],
    ];

    const structureList = tiles.map(tile => State.findStructure(tile.structureNum));

    for (const structure of structureList) {
      if (structure !== undefined && structure.type === 'tree') {
        points += 5;
        woodRequired -= 2;
      }
    }
    if (State.wood >= woodRequired) {
      MapUtil.addStructure(tiles, 'stockpileW_con', structureNum);

      State.structures.push({ structureNum, type: 'stockpileW_con', originRow: row, originCol: col, pointsLeft: points, pointsStart: points });

      State.buildingQueue.push({ queueOrder, structure: structureNum });

      queueOrder++;
      houseNum++;
      structureNum++;
      State.wood -= woodRequired;
      MapUtil.setWoodText(State.wood, State.maxWood);
    }
  },
  addSmallBarn(row, col) {
    let points = 10;
    let woodRequired = 20;

    const tiles = [
      map[row][col],
      map[row][col + 1],
      map[row + 1][col],
      map[row + 1][col + 1],
    ];

    const structureList = tiles.map(tile => State.findStructure(tile.structureNum));

    for (const structure of structureList) {
      if (structure !== undefined && structure.type === 'tree') {
        points += 5;
        woodRequired -= 2;
      }
    }
    if (State.wood >= woodRequired) {
      MapUtil.addStructure(tiles, 'smallBarn_con', structureNum);

      State.structures.push({ structureNum, type: 'smallBarn_con', originRow: row, originCol: col, pointsLeft: points, pointsStart: points });

      State.buildingQueue.push({ queueOrder, structure: structureNum });

      queueOrder++;
      houseNum++;
      structureNum++;
      State.wood -= woodRequired;
      MapUtil.setWoodText(State.wood, State.maxWood);
    }
  },
};
MapUtil.addMountain1_0(0, 0);
MapUtil.addHouse1_complete(8, 6);
MapUtil.addHouse1_complete(8, 8);


let mapCanvas = null;
// applying textures to the above array
const MapView = {
  init(canvas) {
    window.addEventListener('resize', () => MapView.render(canvas));
    canvas.addEventListener('click', click => MapView.handleClick(click, canvas));
    canvas.addEventListener('mousemove', move => MapView.handleMove(move, canvas));
    MapView.render(canvas);
    mapCanvas = canvas;
  },
  addSapling(row, col) {
    const tile = map[row][col];
    if (tile.foreground === 'nothing') {
      tile.foreground = 'tree0';
      tile.structureNum = structureNum;
      State.structures.push({ structureNum, type: 'sapling', originRow: row, originCol: col, pointsLeft: 0, pointsStart: 0 });
      structureNum++;
      MapView.render(mapCanvas);
    }
  },
  growTrees(structureNum) {
    const structure = State.findStructure(structureNum);
    if (structure.type === 'sapling') {
      map[structure.originRow][structure.originCol].foreground = 'tree1';
      structure.type = 'tree';

      MapView.render(mapCanvas);
    }
    if (structure.type === 'tree') {
      if (structure.pointsLeft === 1) {
        map[structure.originRow][structure.originCol].foreground = 'tree2';
        MapView.render(mapCanvas);
      }
      if (structure.pointsLeft === 2) {
        map[structure.originRow][structure.originCol].foreground = 'tree3';
        MapView.render(mapCanvas);
      }
    }
  },

  updateBuilding(structureNum) {
    const structure = State.findStructure(structureNum);
    if (structure.type === 'house1_con') {
      map[structure.originRow][structure.originCol].foreground = 'house1';
      structure.type = 'house1';
            // storage push - probably can be separated into function
      const maxWood = 5;
      const maxFood = 25;
      const peepSpots = 4;

      State.storages.push({ structure: structureNum, maxWood, curWood: 0, maxFood, curFood: 0 });
      State.houses.push({ houseNum, structure: structureNum, peepSpots });

      State.maxWood += maxWood;
      State.maxFood += maxFood;

            // peeps can now live in house

      MapUtil.setWoodText(State.wood, State.maxWood);
      MapUtil.setFoodText(State.Food);

      MapView.render(mapCanvas);
    }
    if (structure.type === 'stockpileW_con') {
      map[structure.originRow][structure.originCol].foreground = 'stockpileW_0';
      structure.type = 'stockpileW';
            // storage push - probably can be separated into function
      const maxWood = 50;
      const maxFood = 0;
      State.storages.push({ structure: structureNum, maxWood, curWood: 0, maxFood, curFood: 0 });
      State.maxWood += maxWood;
      State.maxFood += maxFood;

      MapUtil.setWoodText(State.wood, State.maxWood);

      MapView.render(mapCanvas);
    }
    if (structure.type === 'smallBarn_con') {
      map[structure.originRow][structure.originCol].foreground = 'smallBarn';
      structure.type = 'smallBarn';
            // storage push - probably can be separated into function
      const maxWood = 0;
      const maxFood = 100;
      State.storages.push({ structure: structureNum, maxWood, curWood: 0, maxFood, curFood: 0 });
      State.maxWood += maxWood;
      State.maxFood += maxFood;

      MapUtil.setFoodText(State.food, State.maxFood);

      MapView.render(mapCanvas);
    }
    if (structure.type === 'tree') {
      map[structure.originRow][structure.originCol].foreground = 'nothing';
      map[structure.originRow][structure.originCol].structureNum = undefined;
      const index = State.structures.indexOf(structure);

      State.structures.splice(index, 1);

      MapView.render(mapCanvas);
    }
    if (structure.type === 'farmland_empty' && State.currentMonth === 3) {
      map[structure.originRow][structure.originCol].foreground = 'farmland_1';
      structure.type = 'farmland_1';

      MapView.render(mapCanvas);
    }
    if (structure.type === 'farmland_1' && State.currentMonth === 4) {
      map[structure.originRow][structure.originCol].foreground = 'farmland_2';
      structure.type = 'farmland_2';

      MapView.render(mapCanvas);
    }
    if (structure.type === 'farmland_2' && State.currentMonth === 6) {
      map[structure.originRow][structure.originCol].foreground = 'farmland_3';
      structure.type = 'farmland_3';

      MapView.render(mapCanvas);
    }
    if (structure.type === 'farmland_3' && State.currentMonth === 8) {
      map[structure.originRow][structure.originCol].foreground = 'farmland_4';
      structure.type = 'farmland_4';

      MapView.render(mapCanvas);
    }
    if ((structure.type === 'farmland_4' && State.currentMonth === 9) || (structure.type === 'farmland_dead' && State.currentMonth === 9)) {
      map[structure.originRow][structure.originCol].foreground = 'farmland_empty';
      structure.type = 'farmland_empty';
      structure.pointsLeft = 0;

      MapView.render(mapCanvas);
    }
    if (structure.type === 'farmland_1' || structure.type === 'farmland_2' || structure.type === 'farmland_3' || structure.type === 'farmland_4') {
      if (structure.pointsLeft === -1) {
        map[structure.originRow][structure.originCol].foreground = 'farmland_dead';
        structure.type = 'farmland_dead';

        MapView.render(mapCanvas);
      }
    }
  },

  handleClick({ layerX, layerY }, canvas) {
    const row = Math.floor(layerY / 32);
    const col = Math.floor(layerX / 32);
    if (State.buildingChoice !== undefined) {
      if (State.buildingChoice.type === 'house1') {
        MapUtil.addHouse1(row, col);
        MapView.render(canvas);
        State.buildingChoice = undefined;
      } else if (State.buildingChoice.type === 'farmland_empty') {
        MapUtil.addFarmland_empty(row, col);
        MapView.render(canvas);
        State.buildingChoice = undefined;
      } else if (State.buildingChoice.type === 'stockpileW_con') {
        MapUtil.addStockpileW(row, col);
        MapView.render(canvas);
        State.buildingChoice = undefined;
      } else if (State.buildingChoice.type === 'smallBarn_con') {
        MapUtil.addSmallBarn(row, col);
        MapView.render(canvas);
        State.buildingChoice = undefined;
      }
    }
    if (map[row][col].structureNum !== undefined) {
      const structure = State.findStructure(map[row][col].structureNum);
      console.log('clicking on grid:', col, ',', row);
      console.log('structure Im trying to click on', map[row][col].structureNum);
      console.log('structure type Im trying to click on', structure.type);

      if (structure.type === 'farmland_empty' && State.currentMonth === 3) {
        MapView.updateBuilding(map[row][col].structureNum);
        MapView.render(canvas);
      }
    }
  },

  housePeepsList(peeps, i) {
    State.findSpouse(peeps[i], i);
    return (`${peeps[i].name}, ${peeps[i].job}, Age: ${peeps[i].age}, Spouse: `);
  },
  builderPeepsList(peeps, i) {
    return (`${peeps[i].name}, Level ${Math.floor(peeps[i].buildSkill)}`);
  },
  farmerPeepsList(peeps, i) {
    return (`${peeps[i].name}, Level ${Math.floor(peeps[i].farmSkill)}`);
  },
  gatherPeepsList(peeps, i) {
    return (`${peeps[i].name}, Level ${Math.floor(peeps[i].gatherSkill)}`);
  },

  drawHovered(context, textures, structure) {
    const { type, originRow, originCol, pointsLeft, pointsStart } = structure;


        // hover text info - repeated multiple times, so outside the ifs
    const rectBegin = (originRow * 32 - 4);
    const textBegin = (originRow * 32 + 16);

    context.font = '20px Arial';

    if (type === 'house1') {
      const house = State.findHouse(structure.structureNum);
      const peeps = State.findPeepsByHouse(house.houseNum);

      context.clearRect(originCol * 32, originRow * 32, 64, 64);
      context.drawImage(textures.grass1, originCol * 32, originRow * 32);
      context.drawImage(textures.house1_open, originCol * 32, originRow * 32);

            // list Peeps in this house
      const textBoxWidth =220;

      for (i = 0; i < peeps.length; i++) {
        context.fillStyle = 'rgb(200, 200, 200)';
        context.fillRect(originCol * 32 + 64, rectBegin + (i * 24), textBoxWidth, 24);

        context.fillStyle = 'rgb(10, 10, 10)';
        context.fillText(MapView.housePeepsList(peeps, i), originCol * 32 + 64, textBegin + (i * 24));
      }
    }

    if (type === 'house1_con' || type === 'stockpileW_con' || type === 'smallBarn_con') {
      const queueOrder = State.findQueueOrder(structure.structureNum).queueOrder;

      const peeps = State.findPeepsByJob('builder');
      context.fillStyle = 'rgb(200, 200, 200)';
      context.fillRect(originCol * 32 + 64, rectBegin, 190, 24);
      context.fillStyle = 'rgb(10, 10, 10)';
      context.fillText(`${pointsLeft}/${pointsStart} Queue spot: ${queueOrder}`, originCol * 32 + 64, textBegin);

            // list builders
      for (i = 0; i < peeps.length; i++) {
        context.fillStyle = 'rgb(200, 200, 200)';
        context.fillRect(originCol * 32 + 64, rectBegin + ((i * 24) + 24), 190, 24);

        context.fillStyle = 'rgb(10, 10, 10)';
        context.fillText(MapView.builderPeepsList(peeps, i), originCol * 32 + 64, textBegin + ((i * 24) + 24));
      }
    }

    if (type === 'stockpileW') {
      const peeps = State.findPeepsByJob('gatherer');
            // context.fillStyle = 'rgb(200, 200, 200)'
            // context.fillRect(originCol * 32 + 64, rectBegin, 190, 24)
            // context.fillStyle = 'rgb(10, 10, 10)'

            // list gatherers
      for (i = 0; i < peeps.length; i++) {
        context.fillStyle = 'rgb(200, 200, 200)';
        context.fillRect(originCol * 32 + 64, rectBegin + ((i * 24)), 190, 24);

        context.fillStyle = 'rgb(10, 10, 10)';
        context.fillText(MapView.gatherPeepsList(peeps, i), originCol * 32 + 64, textBegin + ((i * 24)));
      }
    }
    if (type === 'farmland_empty' || type === 'farmland_1' || type === 'farmland_2' || type === 'farmland_3' || type === 'farmland_4') {
      const queueOrder = State.findFarmQueueOrder(structure.structureNum).queueOrder;

      const peeps = State.findPeepsByJob('farmer');
      context.fillStyle = 'rgb(200, 200, 200)';
      context.fillRect(originCol * 32 + 64, rectBegin, 190, 24);
      context.fillStyle = 'rgb(10, 10, 10)';
      context.fillText(`${pointsLeft}/${pointsStart} Queue spot: ${queueOrder}`, originCol * 32 + 64, textBegin);

            // list farmers
      for (var i = 0; i < peeps.length; i++) {
        context.fillStyle = 'rgb(200, 200, 200)';
        context.fillRect(originCol * 32 + 64, rectBegin + ((i * 24) + 24), 190, 24);

        context.fillStyle = 'rgb(10, 10, 10)';
        context.fillText(MapView.farmerPeepsList(peeps, i), originCol * 32 + 64, textBegin + ((i * 24) + 24));
      }
    }
  },

  handleMove({ layerX, layerY }, canvas) {
    const row = Math.floor(layerY / 32);
    const col = Math.floor(layerX / 32);

    if (MapView.isOverMap(row, col)) {
      const tile = map[row][col];
      const structure = State.findStructure(tile.structureNum);

      const context = canvas.getContext('2d');

      MapView
                .render(canvas)
                .then((textures) => {
                  if (structure) {
                    MapView.drawHovered(context, textures, structure);

                    console.log('is a structure');
                  }
                  if (State.buildingChoice !== undefined) {
                    const rows = State.buildingChoice.rows;
                    const cols = State.buildingChoice.cols;
                        // if buildingChoice is farmland, check if there are trees, then color red if yes.
                    if (State.buildingChoice.type === 'farmland_empty') {
                      const tiles = MapUtil.newTiles(rows, cols, row, col);
                      const isNothing = tile => tile.foreground === 'nothing';
                      if (tiles.every(isNothing)) {
                      } else {
                        context.strokeStyle = 'rgb(200, 0, 0)';
                      }
                    } else {
                      const tiles = MapUtil.newTiles(rows, cols, row, col);
                      const isNothing = tile => tile.foreground === 'nothing';
                      const treeForegrounds = ['tree0', 'tree1', 'tree2', 'tree3'];
                      const isTree = tile => treeForegrounds.includes(tile.foreground);
                      const canBuildHere = tile => isNothing(tile) || isTree(tile);

                      if (tiles.every(canBuildHere)) {
                      } else {
                        context.strokeStyle = 'rgb(200, 0, 0)';
                      }
                    }

                    context.strokeRect(col * 32, row * 32, (32 * cols), (32 * rows));
                  } else {
                    context.strokeRect(col * 32, row * 32, 32, 32);
                  }
                });
    }
  },

  isOverMap(row, col) {
    return map[row] && map[row][col];
  },

  draw(context, textures) {
        // grass
    for (const row of range(Math.floor(NUM_ROWS / 4))) {
      for (const col of range(Math.floor(NUM_COLS / 4))) {
        let grassType = map[row][col].background;
        if (State.currentMonth === 10 || State.currentMonth === 2) {
          grassType = 'snow0';
        }
        if (State.currentMonth === 11 || State.currentMonth === 1) {
          grassType = 'snow1';
        }
        if (State.currentMonth === 12 || State.currentMonth === 0) {
          grassType = 'snow2';
        }
        context.drawImage(textures[grassType], col * 128, row * 128);
      }
    }
        // all other structures
    for (const row of map) {
      for (const tile of row) {
        if (tile.foreground in textures) {
          let print = tile.foreground;
          // snowfall on mountains
          if ((State.currentMonth === 11 || State.currentMonth === 1) && print === 'mountain1_0') {
            print = 'mountain1_1';
          }
          if ((State.currentMonth === 12 || State.currentMonth === 0) && print === 'mountain1_0') {
            print = 'mountain1_2';
          }
          if ((print === 'stockpileW_0')) {
            const arr = [
              'stockpileW_0',
              'stockpileW_1',
              'stockpileW_2',
              'stockpileW_3',
              'stockpileW_4',
              'stockpileW_5',
              'stockpileW_6',
              'stockpileW_7',
            ];
            let result = Math.floor(((State.wood / State.maxWood) * 8) - 1);
            if (result < 0) {
              result = 0;
            }
            print = arr[result];
          }
          context.drawImage(textures[print], tile.x * 32, tile.y * 32);
        }
      }
    }

    return textures;
  },

  render(canvas) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const context = canvas.getContext('2d');
    return loadTextures
            .then(textures => MapView.draw(context, textures));
  },
};

module.exports = MapView;
module.exports = {
  MapView,
  MapUtil,
};
