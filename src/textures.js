const grass = new Image();
const tree1 = new Image();
const tree2 = new Image();
const tree3 = new Image();
const house1 = new Image();
const house1_con = new Image();
const house1_open = new Image();

const farmland_empty = new Image();
const farmland_1 = new Image();
const farmland_2 = new Image();
const farmland_3 = new Image();
const farmland_4 = new Image();
const farmland_dead = new Image();

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
const house1_conPromise = new Promise((resolve, _reject) => {
    house1_con.addEventListener('load', () => {
        resolve({ house1_con });
    });
});
const house1_openPromise = new Promise((resolve, _reject) => {
    house1_open.addEventListener('load', () => {
        resolve({ house1_open });
    });
});

const farmland_emptyPromise = new Promise((resolve, _reject) => {
    farmland_empty.addEventListener('load', () => {
        resolve({ farmland_empty });
    });
});
const farmland_1Promise = new Promise((resolve, _reject) => {
    farmland_1.addEventListener('load', () => {
        resolve({ farmland_1 });
    });
});
const farmland_2Promise = new Promise((resolve, _reject) => {
    farmland_2.addEventListener('load', () => {
        resolve({ farmland_2 });
    });
});
const farmland_3Promise = new Promise((resolve, _reject) => {
    farmland_3.addEventListener('load', () => {
        resolve({ farmland_3 });
    });
});
const farmland_4Promise = new Promise((resolve, _reject) => {
    farmland_4.addEventListener('load', () => {
        resolve({ farmland_4 });
    });
});
const farmland_deadPromise = new Promise((resolve, _reject) => {
    farmland_dead.addEventListener('load', () => {
        resolve({ farmland_dead });
    });
});


grass.src = './textures/village_map/map/ground/grass.png';
tree1.src = './textures/village_map/map/buildings/tree1.png';
tree2.src = './textures/village_map/map/buildings/tree2.png';
tree3.src = './textures/village_map/map/buildings/tree3.png';
house1.src = './textures/village_map/map/buildings/house1.png';
house1_con.src = './textures/village_map/map/buildings/house1_inconstruction.png';
house1_open.src = './textures/village_map/map/buildings/house1_open.png';
farmland_empty.src = './textures/village_map/map/buildings/farmland_empty.png';

farmland_1.src = './textures/village_map/map/buildings/farmland_1.png';
farmland_2.src = './textures/village_map/map/buildings/farmland_2.png';
farmland_3.src = './textures/village_map/map/buildings/farmland_3.png';
farmland_4.src = './textures/village_map/map/buildings/farmland_4.png';
farmland_dead.src = './textures/village_map/map/buildings/farmland_dead.png';

const allLoaded = Promise
    .all([grassPromise, tree1Promise, tree2Promise, tree3Promise, house1Promise, house1_conPromise, house1_openPromise, farmland_emptyPromise, farmland_1Promise, farmland_2Promise, farmland_3Promise, farmland_4Promise, farmland_deadPromise])
    .then(images => Object.assign(...images));

module.exports = allLoaded;