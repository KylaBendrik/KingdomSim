const loadTextures = require('./textures');
const State = require('./state');

const range = function range(n) {
    return [...Array(n).keys()];
}

//initialize

State.peeps.push(
    {name: 'Adam', job: 'builder', house: 0, buildSkill: 0, farmSkill: 0, gatherSkill: 0}, 
    {name: 'Eve', job: 'gatherer', house: 0, buildSkill: 0, farmSkill: 0, gatherSkill: 0}
);

//resources - probably a better spot



//map stuff

const map = []
const NUM_ROWS = 14;
const NUM_COLS = 20;
var houseNum = 0;
var structureNum= 0;
var queueOrder = 0;

//making the map randomly
for (var y = 0; y < NUM_ROWS; y++){
    var newLine = [];

    for (var x = 0; x < NUM_COLS; x++){
        ifTree = Math.floor(Math.random() * 4)
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

//adding default houses
const MapUtil = {
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
        console.log(structureNum)
    },
    addHouse1(row, col) {
        var points = 20;

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
            }
        }

        MapUtil.addStructure(tiles, 'house1_con', structureNum);

        State.houses.push({houseNum: houseNum, structure: structureNum})
        State.structures.push({structureNum: structureNum, type: 'house1_con', originRow: row, originCol: col, pointsLeft: points, pointsStart: points})
        State.buildingQueue.push({queueOrder: queueOrder, structure: structureNum})
        
        queueOrder ++;
        houseNum ++;        
        structureNum ++;
        console.log(structureNum)
        console.log(State.buildingQueue)
    },
    addFarmland_1(row, col) {
        var points = 0;

        const tiles = [
            map[row][col],
            map[row][col + 1],
            map[row + 1][col],
            map[row + 1][col + 1]
        ]

        const isNothing = tile => tile.foreground==='nothing'

        if (tiles.every(isNothing)){
            MapUtil.addStructure(tiles, 'farmland_1', structureNum);

            State.structures.push({structureNum: structureNum, type: 'farmland_1', originRow: row, originCol: col, pointsLeft: points, pointsStart: points})
           
            structureNum ++;
            console.log(structureNum)
        }
        
    }
}

MapUtil.addHouse1_complete(3,3);
MapUtil.addHouse1_complete(3,6);

console.log(State.structures)

//applying textures to the above array
const MapView = {
    init(canvas){
        window.addEventListener('resize', () => MapView.render(canvas));
        canvas.addEventListener('click', click => MapView.handleClick(click, canvas));
        canvas.addEventListener('mousemove', move => MapView.handleMove(move, canvas));
        MapView.render(canvas);
    },

    handleClick({layerX, layerY}, canvas){
        const row = Math.floor(layerY / 32);   
        const col = Math.floor(layerX / 32);

        console.log(row, col, State.buildingChoice)

        if (State.buildingChoice === 'house1') {
            MapUtil.addHouse1(row, col);
            MapView.render(canvas);
            State.buildingChoice = undefined;
        }
        if (State.buildingChoice === 'farmland_1') {
            MapUtil.addFarmland_1(row, col);
            MapView.render(canvas);
            State.buildingChoice = undefined;
        }
    },

    housePeepsList(peeps, i){
        return (peeps[i].name + ", " + peeps[i].job);
    },
    builderPeepsList(peeps, i){
        return (peeps[i].name + ", Level " + peeps[i].buildSkill);
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

