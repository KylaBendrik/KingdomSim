const loadTextures = require('./peepTextures');

var portrait = document.getElementById("portrait");

const context = portrait.getContext('2d');



const PortraitView = {
    init(portrait){
        window.addEventListener('resize', () => MapView.render(portrait));
        MapView.render(portrait);
    },

   draw(context, textures) {
    
        context.drawImage(textures.defaultPortrait)
        return textures;
    },

    render(portrait) {

        const context = portrait.getContext('2d');

        return loadTextures
            .then(textures => PortraitView.draw(context, textures));
        }
};

module.exports = PortraitView;

