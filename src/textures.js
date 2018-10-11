const setupTexture = function setupTexture([name, path]) {
    const image = new Image();
    const promise = new Promise((resolve, _reject) => {
        image. addEventListener('load', () => {
            resolve({ [name]: image});
        });
    });

    image.src = `./textures/${path}.png`;

    return promise;
};

const images = {
    grass1: 'village_map/map/ground/grass1',
    grass2: 'village_map/map/ground/grass2',
    grass3: 'village_map/map/ground/grass3',
    grass4: 'village_map/map/ground/grass4',

    snow0: 'village_map/map/ground/snow0',
    snow1: 'village_map/map/ground/snow1',
    snow2: 'village_map/map/ground/snow2',

    mountain1_0: 'village_map/map/nature/mountain1_0',
    mountain1_1: 'village_map/map/nature/mountain1_1',
    mountain1_2: 'village_map/map/nature/mountain1_2',

    tree0: 'village_map/map/nature/tree0',
    tree1: 'village_map/map/nature/tree1',
    tree2: 'village_map/map/nature/tree2',
    tree3: 'village_map/map/nature/tree3',

    house1: 'village_map/map/buildings/house1',
    house1_con: 'village_map/map/buildings/house1_inconstruction',
    house1_open: 'village_map/map/buildings/house1_open',

    farmland_empty: 'village_map/map/buildings/farmland_empty',
    farmland_1: 'village_map/map/buildings/farmland_1',
    farmland_2: 'village_map/map/buildings/farmland_2',
    farmland_3: 'village_map/map/buildings/farmland_3',
    farmland_4: 'village_map/map/buildings/farmland_4',
    farmland_dead: 'village_map/map/buildings/farmland_dead',

};

const allLoaded = Promise
    .all(Object.entries(images).map(setupTexture))
    .then(images => Object.assign(...images));

module.exports = allLoaded;
