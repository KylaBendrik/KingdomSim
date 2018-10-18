const setupTexture = function setupTexture([name, path]) {
    const image = new Image();
    const promise = new Promise((resolve, _reject) => {
        image. addEventListener('load', () => {
            resolve({ [name]: image});
        });
    });

    image.src = `../textures/village_map/map/${path}.png`;

    return promise;
};

const images = {
    grass1: 'ground/grass1',
    grass2: 'ground/grass2',
    grass3: 'ground/grass3',
    grass4: 'ground/grass4',

    snow0: 'ground/snow0',
    snow1: 'ground/snow1',
    snow2: 'ground/snow2',

    mountain1_0: 'nature/mountain1_0',
    mountain1_1: 'nature/mountain1_1',
    mountain1_2: 'nature/mountain1_2',

    tree0: 'nature/tree0',
    tree1: 'nature/tree1',
    tree2: 'nature/tree2',
    tree3: 'nature/tree3',

    house1: 'buildings/house1',
    house1_con: 'buildings/house1_inconstruction',
    house1_open: 'buildings/house1_open',

    farmland_empty: 'buildings/farmland_empty',
    farmland_1: 'buildings/farmland_1',
    farmland_2: 'buildings/farmland_2',
    farmland_3: 'buildings/farmland_3',
    farmland_4: 'buildings/farmland_4',
    farmland_dead: 'buildings/farmland_dead',

    smallBarn: 'buildings/storage/smallBarn',
    smallBarn_con: 'buildings/storage/smallBarn_con',

    stockpileW_con: 'buildings/storage/stockpileW_con',
    stockpileW_0: 'buildings/storage/stockpileW_0',
    stockpileW_1: 'buildings/storage/stockpileW_1',
    stockpileW_2: 'buildings/storage/stockpileW_2',
    stockpileW_3: 'buildings/storage/stockpileW_3',
    stockpileW_4: 'buildings/storage/stockpileW_4',
    stockpileW_5: 'buildings/storage/stockpileW_5',
    stockpileW_6: 'buildings/storage/stockpileW_6',
    stockpileW_7: 'buildings/storage/stockpileW_7',

};

const allLoaded = Promise
    .all(Object.entries(images).map(setupTexture))
    .then(images => Object.assign(...images));

module.exports = allLoaded;
