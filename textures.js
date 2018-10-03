const grass = new Image();
const tree = new Image();
const house1 = new Image();

const farmland = new Image();

const grassPromise = new Promise((resolve, _reject) => {
    grass.addEventListener('load', () => {
        resolve({ grass });
    });
});

const treePromise = new Promise((resolve, _reject) => {
    tree.addEventListener('load', () => {
        resolve({ tree });
    });
});

const house1Promise = new Promise((resolve, _reject) => {
    house1.addEventListener('load', () => {
        resolve({ house1 });
    });
});

const farmlandPromise = new Promise((resolve, _reject) => {
    farmland.addEventListener('load', () => {
        resolve({ farmland });
    });
});


grass.src = './textures/village_map/map/ground/grass.png';
tree.src = './textures/village_map/map/buildings/tree1.png';
house1.src = './textures/village_map/map/buildings/house1.png';
farmland.src = './textures/village_map/map/buildings/farmland_empty.png';

const allLoaded = Promise
    .all([grassPromise, treePromise, house1Promise, farmlandPromise])
    .then(images => Object.assign(...images));

module.exports = allLoaded;