const MapView = require('./src/map');
const DateView = require('./src/date');
const BuildOptions = require('./src/buildOptions');

const IDs= [
    'map',
    'date',
    'month_button',
    'alert',
    'buildChoiceHouse1',
    'buildChoiceFarmland'
];

const getElements = function getElements(elements, id) {
    elements[id] = document.getElementById(id);

    return elements;
}

document.addEventListener('DOMContentLoaded',() => {
    const elements = IDs.reduce(getElements, {});

    MapView.init(elements.map);
    DateView.init(elements.date, elements.month_button, elements.alert, MapView);
    BuildOptions.init(elements.buildChoiceHouse1, elements.buildChoiceFarmland);

});