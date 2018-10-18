const MapMethods = require('./map');
const MapView = MapMethods.MapView;
const MapUtil = MapMethods.MapUtil;


const DateView = require('./date');
const BuildOptions = require('./buildOptions');

const IDs= [
    'map',
    'date',
    'month_button',
    'alert',
    'buildChoiceHouse1',
    'buildChoiceFarmland',
    'buildChoiceStockpileW',
    'buildChoiceSmallBarn'
];

const getElements = function getElements(elements, id) {
    elements[id] = document.getElementById(id);

    return elements;
}

document.addEventListener('DOMContentLoaded',() => {
    const elements = IDs.reduce(getElements, {});

    MapView.init(elements.map);
    DateView.init(elements.date, elements.month_button, elements.alert, MapView, MapUtil);
    BuildOptions.init(elements.buildChoiceHouse1, elements.buildChoiceFarmland, elements.buildChoiceStockpileW, elements.buildChoiceSmallBarn);

});