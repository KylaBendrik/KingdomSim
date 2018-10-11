const grass1 = new Image();
const grass2 = new Image();
const grass3 = new Image();
const grass4 = new Image();


const snow0 = new Image();
const snow1 = new Image();
const snow2 = new Image();

const mountain1_0 = new Image();
const mountain1_1 = new Image();
const mountain1_2 = new Image();

const tree0 = new Image();
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

const grass1Promise = new Promise((resolve, _reject) => {
    grass1.addEventListener('load', () => {
        resolve({ grass1 });
    });
});
const grass2Promise = new Promise((resolve, _reject) => {
    grass2.addEventListener('load', () => {
        resolve({ grass2 });
    });
});
const grass3Promise = new Promise((resolve, _reject) => {
    grass3.addEventListener('load', () => {
        resolve({ grass3 });
    });
});
const grass4Promise = new Promise((resolve, _reject) => {
    grass4.addEventListener('load', () => {
        resolve({ grass4 });
    });
});
const snow0Promise = new Promise((resolve, _reject) => {
    snow0.addEventListener('load', () => {
        resolve({ snow0 });
    });
});
const snow1Promise = new Promise((resolve, _reject) => {
    snow1.addEventListener('load', () => {
        resolve({ snow1 });
    });
});
const snow2Promise = new Promise((resolve, _reject) => {
    snow2.addEventListener('load', () => {
        resolve({ snow2 });
    });
});
const mountain1_0Promise = new Promise((resolve, _reject) => {
    mountain1_0.addEventListener('load', () => {
        resolve({ mountain1_0 });
    });
});
const mountain1_1Promise = new Promise((resolve, _reject) => {
    mountain1_1.addEventListener('load', () => {
        resolve({ mountain1_1 });
    });
});
const mountain1_2Promise = new Promise((resolve, _reject) => {
    mountain1_2.addEventListener('load', () => {
        resolve({ mountain1_2 });
    });
});

const tree0Promise = new Promise((resolve, _reject) => {
    tree0.addEventListener('load', () => {
        resolve({ tree0 });
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


grass1.src = './textures/village_map/map/ground/grass1.png';
grass2.src = './textures/village_map/map/ground/grass2.png';
grass3.src = './textures/village_map/map/ground/grass3.png';
grass4.src = './textures/village_map/map/ground/grass4.png';

snow0.src = './textures/village_map/map/ground/snow0.png';
snow1.src = './textures/village_map/map/ground/snow1.png';
snow2.src = './textures/village_map/map/ground/snow2.png';

mountain1_0.src = './textures/village_map/map/nature/mountain1_0.png';
mountain1_1.src = './textures/village_map/map/nature/mountain1_1.png';
mountain1_2.src = './textures/village_map/map/nature/mountain1_2.png';

tree0.src = './textures/village_map/map/nature/tree0.png';
tree1.src = './textures/village_map/map/nature/tree1.png';
tree2.src = './textures/village_map/map/nature/tree2.png';
tree3.src = './textures/village_map/map/nature/tree3.png';

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
    .all([
        grass1Promise, 
        grass2Promise, 
        grass3Promise, 
        grass4Promise, 
        snow0Promise, 
        snow1Promise, 
        snow2Promise, 
        mountain1_0Promise,
        mountain1_1Promise,
        mountain1_2Promise, tree0Promise, tree1Promise, tree2Promise, tree3Promise, house1Promise, house1_conPromise, house1_openPromise, farmland_emptyPromise, farmland_1Promise, farmland_2Promise, farmland_3Promise, farmland_4Promise, farmland_deadPromise])
    .then(images => Object.assign(...images));

module.exports = allLoaded;