const grass = new Image();
const tree1 = new Image();
const tree2 = new Image();
const tree3 = new Image();
const house1 = new Image();

const farmland = new Image();

const grassPromise = new Promise((resolve, _reject) => {
    grass.addEventListener('load', () => {
        resolve({ grass });
    });
});

const tree1Promise = new Promise((resolve, _reject) => {
    tree1.addEventListener('load', () => {
        resolve({ tree1 });
    });
});

const tree2Promise = new Promise((resolve, _reject) => {
    tree2.addEventListener('load', () => {
        resolve({ tree2 });
    });
});
const tree3Promise = new Promise((resolve, _reject) => {
    tree3.addEventListener('load', () => {
        resolve({ tree3 });
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
tree1.src = './textures/village_map/map/buildings/tree1.png';
tree2.src = './textures/village_map/map/buildings/tree2.png';
tree3.src = './textures/village_map/map/buildings/tree3.png';
house1.src = './textures/village_map/map/buildings/house1.png';
farmland.src = './textures/village_map/map/buildings/farmland_empty.png';

const allLoaded = Promise
    .all([grassPromise, tree1Promise, tree2Promise, tree3Promise, house1Promise, farmlandPromise])
    .then(images => Object.assign(...images));

module.exports = allLoaded;