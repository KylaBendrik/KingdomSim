const loadTextures = require('./textures');

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
    addHouse1_complete(x, y) {
        map[x][y].foreground = 'house1';
        map[x][y+1].foreground= 'nothing';
        map[x+1][y].foreground= 'nothing';
        map[x+1][y+1].foreground= 'nothing';
    },
    addHouse1(x, y) {
        map[x][y].foreground = 'house1_con';
        map[x][y+1].foreground= 'nothing';
        map[x+1][y].foreground= 'nothing';
        map[x+1][y+1].foreground= 'nothing';
    }
}

MapUtil.addHouse1_complete(3,3);
MapUtil.addHouse1(3,6);

//applying textures to the above array
const MapView = {
    draw(context, textures) {
        for (const row of range(Math.floor(NUM_ROWS / 2))) {
            for (const col of range(Math.floor(NUM_COLS / 2))){
                context.drawImage(textures.grass, col * 64, row * 64)
            }
        }

        for (const row of map) {
            for (const tile of row) {
                if (tile.foreground !== 'nothing'){                    
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

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('map');

    window.addEventListener('resize', () => MapView.resize(canvas));

    MapView.resize(canvas);
});

