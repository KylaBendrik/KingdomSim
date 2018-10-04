const loadTextures = require('./textures');



const map = []

//making the map randomly
for (var y = 0; y < 8; y++){
    var newLine = [];

    for (var x = 0; x < 9; x++){
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
map[3][2].foreground = 'house1';
map[3][3].foreground = 'house1';

//applying textures to the above array
const MapView = {
    draw(context, textures) {
        for (const row of map) {
            for (const tile of row) {      
                context.drawImage(textures.grass, tile.x * 64, tile.y * 64)

                if (tile.foreground === 'tree1'){
                    context.drawImage(textures.tree1, tile.x * 64, tile.y * 64)
                }
                if (tile.foreground === 'tree2'){
                    context.drawImage(textures.tree2, tile.x * 64, tile.y * 64)
                }
                if (tile.foreground === 'tree3'){
                    context.drawImage(textures.tree3, tile.x * 64, tile.y * 64)
                }
                if (tile.foreground === 'house1'){
                    context.drawImage(textures.house1, tile.x * 64, tile.y * 64)
                }
                if (tile.foreground === 'farmland'){
                    context.drawImage(textures.farmland, tile.x * 64, tile.y * 64)
                }
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('map');

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const context = canvas.getContext('2d');

    loadTextures
        .then(textures => MapView.draw(context, textures));
});

