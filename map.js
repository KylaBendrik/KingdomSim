const loadTextures = require('./textures');



const map = []

for (var y = 0; y < 8; y++){
    var newLine = [];

    for (var x = 0; x < 9; x++){
        ifTree = Math.floor(Math.random() * 4)
        if (ifTree < 3){
            newLine.push({ x: x, y: y, background: 'grass', foreground: 'tree'})
        } else {
            newLine.push({ x: x, y: y, background: 'grass', foreground: 'nothing'})
        }
    };
    
    map.push(newLine);
}

const MapView = {
    draw(context, textures) {
        for (const row of map) {
            for (const tile of row) {      
                context.drawImage(textures.grass, tile.x * 64, tile.y * 64)

                if (tile.foreground === 'tree'){
                    context.drawImage(textures.tree, tile.x * 64, tile.y * 64)
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

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext('2d');

    loadTextures
        .then(textures => MapView.draw(context, textures));
});

