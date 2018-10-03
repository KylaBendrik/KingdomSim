const loadTextures = require('./textures');



const map = [
    [
        { x: 0, y: 0, background: 'grass', foreground: 'nothing'},
        { x: 1, y: 0, background: 'grass', foreground: 'nothing'},
        { x: 2, y: 0, background: 'grass', foreground: 'nothing'},
        { x: 3, y: 0, background: 'grass', foreground: 'tree'},
        { x: 4, y: 0, background: 'grass', foreground: 'nothing'},
        { x: 5, y: 0, background: 'grass', foreground: 'nothing'},
        { x: 6, y: 0, background: 'grass', foreground: 'nothing'},
        { x: 7, y: 0, background: 'grass', foreground: 'nothing'},
        { x: 8, y: 0, background: 'grass', foreground: 'nothing'},
        { x: 9, y: 0, background: 'grass', foreground: 'nothing'},
    ],
    [
        { x: 0, y: 1, background: 'grass', foreground: 'tree'},
        { x: 1, y: 1, background: 'grass', foreground: 'nothing'},
        { x: 2, y: 1, background: 'grass', foreground: 'house1'},
        { x: 3, y: 1, background: 'grass', foreground: 'nothing'},
        { x: 4, y: 1, background: 'grass', foreground: 'tree'}
    ]
]

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

