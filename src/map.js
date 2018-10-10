const loadTextures = require('./textures');
const State = require('./state');

const range = function range(n) {
    return [...Array(n).keys()];
}

//initialize

State.peeps.push(
    {name: 'Adam', job: 'builder', house: 0, buildSkill: 0, farmSkill: 0, gatherSkill: 0}, 
    {name: 'Eve', job: 'gatherer', house: 0, buildSkill: 0, farmSkill: 0, gatherSkill: 0},
    {name: 'Bob', job: 'farmer', house: 1, buildSkill: 0, farmSkill: 0, gatherSkill: 0}, 
    {name: 'Martha', job: 'farmer', house: 1, buildSkill: 0, farmSkill: 0, gatherSkill: 0},
);




//map stuff

const map = State.map;
const NUM_ROWS = 14;
const NUM_COLS = 20;
var houseNum = 0;
var structureNum= 0;
var queueOrder = 0;
var farmQueueOrder = 0;

//making the map randomly
for (var y = 0; y < NUM_ROWS; y++){
    var newLine = [];

    for (var x = 0; x < NUM_COLS; x++){
        ifTree = Math.floor(Math.random() * 7)
        if (ifTree == 0){
            newLine.push({ x: x, y: y, background: 'grass', foreground: 'tree1', structureNum: structureNum})
            State.structures.push({structureNum: structureNum, type: 'tree', originRow: y, originCol: x, pointsLeft: 5, pointsStart: 5})
            structureNum++;
        } else {
            if (ifTree == 1){
                newLine.push({ x: x, y: y, background: 'grass', foreground: 'tree2', structureNum: structureNum})
                State.structures.push({structureNum: structureNum, type: 'tree', originRow: y, originCol: x, pointsLeft: 5, pointsStart: 5})
                structureNum++;
            } else {
                if (ifTree == 2){
                    newLine.push({ x: x, y: y, background: 'grass', foreground: 'tree3', structureNum: structureNum})
                    State.structures.push({structureNum: structureNum, type: 'tree', originRow: y, originCol: x, pointsLeft: 5, pointsStart: 5})
                    structureNum++;
                } else{    
                    newLine.push({ x: x, y: y, background: 'grass', foreground: 'nothing', structureNum: undefined})
                }
            }
        }
    };
    
    map.push(newLine);
}

//resources - probably a better spot

document.addEventListener('DOMContentLoaded',() => {
    MapUtil.setWoodText(State.wood);
    MapUtil.setFoodText(State.food);
});


//adding default houses
const MapUtil = {
    setWoodText(wood) {   
        document.getElementById("wood").innerHTML = wood;
    },
    setFoodText(food) {   
        document.getElementById("food").innerHTML = food;
    },
    addStructure(tiles, texture, structureNum){
        const [origin, ...rest] = tiles;
        origin.foreground = texture;

        for(const tile of rest){
            tile.foreground = 'structure';
        }
        for(const tile of tiles){
            tile.structureNum = structureNum;
        }
    },
    addHouse1_complete(row, col) {
        const tiles = [
            map[row][col],
            map[row][col + 1],
            map[row + 1][col],
            map[row + 1][col + 1]
        ]

        MapUtil.addStructure(tiles, 'house1', structureNum);
        
        State.houses.push({houseNum: houseNum, structure: structureNum})
        State.structures.push({structureNum: structureNum, type: 'house1', originRow: row, originCol: col, pointsLeft: 0, pointsStart: 20})

        houseNum ++;
        structureNum ++;
    },
    addHouse1(row, col) {
        var points = 20;
        var woodRequired = 20;

        const tiles = [
            map[row][col],
            map[row][col + 1],
            map[row + 1][col],
            map[row + 1][col + 1]
        ]

        const structureList = tiles.map(tile => State.findStructure(tile.structureNum));

        for (const structure of structureList){
            if (structure !== undefined && structure.type === 'tree'){
                points += 5;
                woodRequired -= 2;
            }
        }
        if (State.wood >= woodRequired){

            MapUtil.addStructure(tiles, 'house1_con', structureNum);

            State.houses.push({houseNum: houseNum, structure: structureNum})
            State.structures.push({structureNum: structureNum, type: 'house1_con', originRow: row, originCol: col, pointsLeft: points, pointsStart: points})
            State.buildingQueue.push({queueOrder: queueOrder, structure: structureNum})
            
            queueOrder ++;
            houseNum ++;        
            structureNum ++;
            State.wood -= woodRequired;
            MapUtil.setWoodText(State.wood);

        }
        
    },
    addFarmland_empty(row, col) {
        var points = 0;

        const tiles = [
            map[row][col],
            map[row][col + 1],
            map[row + 1][col],
            map[row + 1][col + 1]
        ]

        const isNothing = tile => tile.foreground==='nothing'

        if (tiles.every(isNothing)){
            MapUtil.addStructure(tiles, 'farmland_empty', structureNum);

            State.structures.push({structureNum: structureNum, type: 'farmland_empty', originRow: row, originCol: col, pointsLeft: points, pointsStart: points})
            
            State.farmingQueue.push({queueOrder: farmQueueOrder, structure: structureNum})

            farmQueueOrder ++;
            structureNum ++;
        }
        
    }
}

MapUtil.addHouse1_complete(3,3);
MapUtil.addHouse1_complete(3,6);

let mapCanvas = null;
//applying textures to the above array
const MapView = {
    init(canvas){
        window.addEventListener('resize', () => MapView.render(canvas));
        canvas.addEventListener('click', click => MapView.handleClick(click, canvas));
        canvas.addEventListener('mousemove', move => MapView.handleMove(move, canvas));
        MapView.render(canvas);
        mapCanvas = canvas;
    },
    
    updateBuilding(structureNum){
        const structure = State.findStructure(structureNum)
        if (structure.type === 'house1_con'){

            map[structure.originRow][structure.originCol].foreground = 'house1';
            structure.type = 'house1'

            MapView.render(mapCanvas);
        }
        if (structure.type === 'tree'){
            map[structure.originRow][structure.originCol].foreground = 'nothing';
            index = State.structures.indexOf(structure);
            
            State.structures.splice(index, 1);

            MapView.render(mapCanvas);
        }
        if (structure.type === 'farmland_empty' && State.currentMonth === 3){
            map[structure.originRow][structure.originCol].foreground = 'farmland_1';
            structure.type = 'farmland_1'

            MapView.render(mapCanvas);
        }
        if (structure.type === 'farmland_1' && State.currentMonth === 5){
            map[structure.originRow][structure.originCol].foreground = 'farmland_2';
            structure.type = 'farmland_2'

            MapView.render(mapCanvas);
        }
        if (structure.type === 'farmland_2' && State.currentMonth === 7){
            map[structure.originRow][structure.originCol].foreground = 'farmland_3';
            structure.type = 'farmland_3'

            MapView.render(mapCanvas);
        }
        if (structure.type === 'farmland_3' && State.currentMonth === 9){
            map[structure.originRow][structure.originCol].foreground = 'farmland_4';
            structure.type = 'farmland_4'

            MapView.render(mapCanvas);
        }
        if (structure.type === 'farmland_1' || structure.type === 'farmland_2' || structure.type === 'farmland_3' || structure.type === 'farmland_4'){
            if (structure.pointsLeft === -1){
                map[structure.originRow][structure.originCol].foreground = 'farmland_dead';
                structure.type = 'farmland_dead'
                console.log ('a farm plot died. Not enough farmers');

                MapView.render(mapCanvas);
            }
        }
    },

    handleClick({layerX, layerY}, canvas){
        const row = Math.floor(layerY / 32);   
        const col = Math.floor(layerX / 32);

        if (State.buildingChoice === 'house1') {
            MapUtil.addHouse1(row, col);
            MapView.render(canvas);
            State.buildingChoice = undefined;
        }
        if (State.buildingChoice === 'farmland_empty') {
            MapUtil.addFarmland_empty(row, col);
            MapView.render(canvas);
            State.buildingChoice = undefined;
        }
        if (map[row][col].foreground === 'farmland_empty' && State.currentMonth === 3) {
            console.log ('attempting to plant seeds.')
            console.log (map[row][col]);
            MapView.updateBuilding(map[row][col].structureNum)
            MapView.render(canvas);
        }
    },

    housePeepsList(peeps, i){
        return (peeps[i].name + ", " + peeps[i].job);
    },
    builderPeepsList(peeps, i){
        return (peeps[i].name + ", Level " + Math.floor(peeps[i].buildSkill));
    },
    farmerPeepsList(peeps, i){
        return (peeps[i].name + ", Level " + Math.floor(peeps[i].farmSkill));
    },

    drawHovered(context, textures, structure) {
        const {type, originRow, originCol, pointsLeft, pointsStart} = structure;


        //hover text info - repeated multiple times, so outside the ifs
        const rectBegin = (originRow * 32 - 4)
        const textBegin = (originRow * 32 + 16)

        context.font = '20px Arial';

        if (type === 'house1') {
            const house = State.findHouse(structure.structureNum);
            const peeps = State.findPeepsByHouse(house.houseNum);

            context.clearRect(originCol*32, originRow *32, 64, 64);
            context.drawImage(textures.grass, originCol * 32, originRow * 32);
            context.drawImage(textures.house1_open, originCol * 32, originRow * 32);

            //list Peeps in this house

            for(i=0; i < peeps.length; i++){
                context.fillStyle = 'rgb(200, 200, 200)'
                context.fillRect(originCol * 32 + 64, rectBegin + (i * 24), 140, 24)
                
                context.fillStyle = 'rgb(10, 10, 10)'
                context.fillText(MapView.housePeepsList(peeps, i), originCol * 32 + 64, textBegin + (i * 24))
            }
        }

        if (type === 'house1_con') {
            const queueOrder = State.findQueueOrder(structure.structureNum).queueOrder;

            const peeps = State.findPeepsByJob('builder');
            context.fillStyle = 'rgb(200, 200, 200)'
            context.fillRect(originCol * 32 + 64, rectBegin, 190, 24)
            context.fillStyle = 'rgb(10, 10, 10)'
            context.fillText(`${pointsLeft}/${pointsStart} Queue spot: ${queueOrder}`, originCol * 32 + 64, textBegin)

            //list builders
            for(i=0; i < peeps.length; i++){
                context.fillStyle = 'rgb(200, 200, 200)'
                context.fillRect(originCol * 32 + 64, rectBegin + ((i * 24) + 24), 190, 24)
                
                context.fillStyle = 'rgb(10, 10, 10)'
                context.fillText(MapView.builderPeepsList(peeps, i), originCol * 32 + 64, textBegin + ((i * 24) + 24))
            }

        }

        if (type === 'farmland_empty' || type === 'farmland_1' || type === 'farmland_2' || type === 'farmland_3' || type === 'farmland_4'){
            const queueOrder = State.findFarmQueueOrder(structure.structureNum).queueOrder;

            const peeps = State.findPeepsByJob('farmer');
            context.fillStyle = 'rgb(200, 200, 200)'
            context.fillRect(originCol * 32 + 64, rectBegin, 190, 24)
            context.fillStyle = 'rgb(10, 10, 10)'
            context.fillText(`${pointsLeft}/${pointsStart} Queue spot: ${queueOrder}`, originCol * 32 + 64, textBegin)

            //list farmers
            for(i=0; i < peeps.length; i++){
                context.fillStyle = 'rgb(200, 200, 200)'
                context.fillRect(originCol * 32 + 64, rectBegin + ((i * 24) + 24), 190, 24)
                
                context.fillStyle = 'rgb(10, 10, 10)'
                context.fillText(MapView.farmerPeepsList(peeps, i), originCol * 32 + 64, textBegin + ((i * 24) + 24))
            }
        }
        
    },

    handleMove({layerX, layerY}, canvas){
        const row = Math.floor(layerY / 32);   
        const col = Math.floor(layerX / 32);

        if (MapView.isOverMap(row, col)) {
            const tile = map[row][col];
            const structure = State.findStructure(tile.structureNum)
            
            const context = canvas.getContext('2d');
            
            MapView
                .render(canvas)
                .then(textures => {
                    if (structure){
                        MapView.drawHovered(context, textures, structure);
                    }
                                            
                    if (State.buildingChoice !== undefined){
                        context.strokeRect(col * 32, row *32, 64, 64);
                    } else {
                        context.strokeRect(col * 32, row *32, 32, 32);
                    }
                });
            
            
        }
    },

    isOverMap(row,col) {
        return map[row] && map[row][col];
    },

    draw(context, textures) {
        
        for (const row of range(Math.floor(NUM_ROWS / 2))) {
            for (const col of range(Math.floor(NUM_COLS / 2))){
                context.drawImage(textures.grass, col * 64, row * 64)
            }
        }

        for (const row of map) {
            for (const tile of row) {
                if (tile.foreground in textures){                    
                    context.drawImage(textures[tile.foreground], tile.x * 32, tile.y * 32)
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
    }
};

module.exports = MapView;
module.exports = {
    MapView: MapView,
    MapUtil: MapUtil
}
