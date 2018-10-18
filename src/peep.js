const loadTextures = require('./src/peepTextures');
const State = require('./state');

document.addEventListener('DOMContentLoaded',() => {
    const peepTable = document.getElementById("peepList");

    PeepList.init(peepTable)
});
State.peeps.push({name: 'Adam', job: 'unassigned', house: 0, buildSkill: 0, farmSkill: 0, gatherSkill: 0});

const PeepList = {
    init(peepTable){
        for (const peep of State.peeps){
            const row = document.createElement('tr');

            const portraitCanvas = document.createElement('canvas');
            const portraitCell = document.createElement('td');
            portraitCell.appendChild(portraitCanvas);
            PortraitView.init(portraitCanvas);

            row.appendChild(portraitCell);
            row.appendChild(PeepList.buildCell(peep.name));
            row.appendChild(PeepList.buildCell(peep.job));
            row.appendChild(PeepList.buildCell(peep.house));
            row.appendChild(PeepList.buildCell(peep.buildSkill));
            row.appendChild(PeepList.buildCell(peep.farmSkill));
            row.appendChild(PeepList.buildCell(peep.gatherSkill));

            peepTable.appendChild(row);
        }
    },

    buildCell(text){
        const cell = document.createElement('td');
        cell.textContent = text;
        return cell;
    }

}


const PortraitView = {
    init(portrait){
        window.addEventListener('resize', () => PortraitView.render(portrait));
        PortraitView.render(portrait);
    },

   draw(context, textures) {    
        context.drawImage(textures.defaultPortrait, 1, 1, 99, 132)
        return textures;
    },

    render(portrait) {
        const context = portrait.getContext('2d');
        portrait.width = 99;
        portrait.height = 132;

        return loadTextures
            .then(textures => PortraitView.draw(context, textures));
        }
};

module.exports = PortraitView;

