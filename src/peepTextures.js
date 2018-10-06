const defaultPortrait = new Image();

const defaultPortraitPromise = new Promise((resolve, _reject) => {
    defaultPortrait.addEventListener('load', () => {
        resolve({ defaultPortrait });
    });
});

defaultPortrait.src = './textures/peeps/default.png';

const allLoaded = Promise
    .all([defaultPortraitPromise])
    .then(images => Object.assign(...images));

module.exports = allLoaded;