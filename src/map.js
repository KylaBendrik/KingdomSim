const loadTextures = require('./textures');
const State = require('./state');

const range = function range(n) {
    return [...Array(n).keys()];
}

const map = []
const NUM_ROWS = 14;
const NUM_COLS = 20;

//making the map randomly
for (var y = 0; y < NUM_ROWS; y++){
    var newLine = [];

    for (var x = 0; x < NUM_COLS; x++){
        ifTree = Math.floor(Math.random() * 4)
        if (ifTree == 0){
            newLine.push({ x: x, y: y, background: 'grass', foreground: 'tree1'})
        } else {
            if (ifTree == 1){
                newLine.push({ x: x, y: y, background: 'grass', foreground: 'tree2'})
            } else {
                if (ifTree == 2){
                    newLine.push({ x: x, y: y, background: 'grass', foreground: 'tree3'})
                } else{    
                    newLine.push({ x: x, y: y, background: 'grass', foreground: 'nothing'})
                }
            }
        }
    };
    
    map.push(newLine);
}

//adding default houses
const MapUtil = {
    addHouse1_complete(row, col) {
        map[row][col].foreground = 'house1';
        map[row][col+1].foreground= 'structure';
        map[row+1][col].foreground= 'structure';
        map[row+1][col+1].foreground= 'structure';
    },
    addHouse1(row, col) {
        map[row][col].foreground = 'house1_con';
        map[row][col+1].foreground= 'structure';
        map[row+1][col].foreground= 'structure';
        map[row+1][col+1].foreground= 'structure';
    }
}

MapUtil.addHouse1_complete(3,3);
MapUtil.addHouse1_complete(3,6);

//applying textures to the above array
const MapView = {
    init(canvas){
        window.addEventListener('resize', () => MapView.resize(canvas));
        canvas.addEventListener('click', click => MapView.handleClick(click, canvas));
        MapView.resize(canvas);
    },

    handleClick({layerX, layerY}, canvas){
        const row = Math.floor(layerY / 32);   
        const col = Math.floor(layerX / 32);

        console.log(row, col, State.buildingChoice)

        if (State.buildingChoice === 'house1') {
            MapUtil.addHouse1(row, col);
            MapView.resize(canvas);
        }
        if (State.buildingChoice === 'farmland') {
            MapUtil.addHouse1(row, col);
            MapView.resize(canvas);
        }
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
        
        
    },

    resize(canvas) {    
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const context = canvas.getContext('2d');

        loadTextures
            .then(textures => MapView.draw(context, textures));
    }
};

module.exports = MapView;

