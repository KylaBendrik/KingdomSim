/* eslint-disable */
const Component = require('component');
const { a, br, button, canvas, div, span, text, style } = require('component/src/html');

const fs = require('fs');

console.log(process.cwd());
const styles = fs.readFileSync('src/pages/map.css');

const MapPage = {
  init() {
    return {
      wood: 0,
      food: 0
    };
  },

  useShadow: true,

  render: model =>
    div({ id: 'frame' },
       [ 
       , style({}, [ text(styles) ])
       , canvas({ id: 'map' }, [])
       , div({ id: 'menu' },
            [ span({ id: 'date' }, [])
            , br()
            , button({ class: 'menubtn', id: 'month_button' }, [ text('Next Month') ])
            , br()
            , button({ class: 'menubtn', id: 'peeps', onclick: 'goToPeeps' }, [ text('Peeps') ])
            , br()
            , MapPage.renderBuildMenu()
            , MapPage.renderResources(model)
            , div({ id: 'alert' })
            , div({ id: 'window' })
            ])
       ])
  ,

  renderBuildMenu: () =>
    div({ class: 'dropdown' },
       [ button({ class: 'dropbtn' }, [ text('Build') ])
       , div({ class: 'dropdown-content' },
            [ a({ href: '#', id: 'buildChoiceHouse1' }, [ text('House'), br(), text('(Wood: 40)') ])
            , a({ href: '#', id: 'buildChoiceFarmland' }, [ text('Farmland'), br(), text('(Wood: 0)') ])
            , a({ href: '#', id: 'buildChoiceStockpileW' } [ text('Wood Stockpile'), br(), text('(Wood: 10)') ])
            , a({ href: '#', id: 'buildChoiceSmallBarn' } [ text('Small Barn'), br(), text('(Wood: 20)') ])
            ])
       ])
  ,

  renderResources: model =>
    div({ class: 'resources' },
       [ text('Wood: ')
       , span({ id: 'wood' }, [ text(model.wood) ])
       , text('Food: ')
       , span({ id: 'food' }, [ text(model.food) ])])
  ,
  
  goToPeeps: (model, event) => undefined
};

Component.define('map-page', MapPage);