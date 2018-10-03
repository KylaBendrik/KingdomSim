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
        { x: 7, y: 0, background: 'grass', foreground: 'tree'},
        { x: 8, y: 0, background: 'grass', foreground: 'nothing'},
        { x: 9, y: 0, background: 'grass', foreground: 'nothing'},
    ],
    [
        { x: 0, y: 1, background: 'grass', foreground: 'nothing'},
        { x: 1, y: 1, background: 'grass', foreground: 'tree'},
        { x: 2, y: 1, background: 'grass', foreground: 'nothing'},
        { x: 3, y: 1, background: 'grass', foreground: 'nothing'},
        { x: 4, y: 1, background: 'grass', foreground: 'nothing'},
        { x: 5, y: 1, background: 'grass', foreground: 'nothing'},
        { x: 6, y: 1, background: 'grass', foreground: 'tree'},
        { x: 7, y: 1, background: 'grass', foreground: 'nothing'},
        { x: 8, y: 1, background: 'grass', foreground: 'tree'},
        { x: 9, y: 1, background: 'grass', foreground: 'nothing'},
    ],
    [
        { x: 0, y: 2, background: 'grass', foreground: 'nothing'},
        { x: 1, y: 2, background: 'grass', foreground: 'nothing'},
        { x: 2, y: 2, background: 'grass', foreground: 'nothing'},
        { x: 3, y: 2, background: 'grass', foreground: 'nothing'},
        { x: 4, y: 2, background: 'grass', foreground: 'house1'},
        { x: 5, y: 2, background: 'grass', foreground: 'farmland'},
        { x: 6, y: 2, background: 'grass', foreground: 'nothing'},
        { x: 7, y: 2, background: 'grass', foreground: 'nothing'},
        { x: 8, y: 2, background: 'grass', foreground: 'nothing'},
        { x: 9, y: 2, background: 'grass', foreground: 'nothing'},
    ],
    [
        { x: 0, y: 3, background: 'grass', foreground: 'nothing'},
        { x: 1, y: 3, background: 'grass', foreground: 'nothing'},
        { x: 2, y: 3, background: 'grass', foreground: 'tree'},
        { x: 3, y: 3, background: 'grass', foreground: 'nothing'},
        { x: 4, y: 3, background: 'grass', foreground: 'nothing'},
        { x: 5, y: 3, background: 'grass', foreground: 'tree'},
        { x: 6, y: 3, background: 'grass', foreground: 'tree'},
        { x: 7, y: 3, background: 'grass', foreground: 'tree'},
        { x: 8, y: 3, background: 'grass', foreground: 'nothing'},
        { x: 9, y: 3, background: 'grass', foreground: 'nothing'},
    ],
    [
        { x: 0, y: 4, background: 'grass', foreground: 'tree'},
        { x: 1, y: 4, background: 'grass', foreground: 'tree'},
        { x: 2, y: 4, background: 'grass', foreground: 'nothing'},
        { x: 3, y: 4, background: 'grass', foreground: 'tree'},
        { x: 4, y: 4, background: 'grass', foreground: 'nothing'},
        { x: 5, y: 4, background: 'grass', foreground: 'nothing'},
        { x: 6, y: 4, background: 'grass', foreground: 'nothing'},
        { x: 7, y: 4, background: 'grass', foreground: 'tree'},
        { x: 8, y: 4, background: 'grass', foreground: 'tree'},
        { x: 9, y: 4, background: 'grass', foreground: 'nothing'},
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

