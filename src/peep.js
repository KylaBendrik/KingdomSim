
const State = require('./state');

const PeepsView = {

  init(peeps_button, peepsMenu){
    document.getElementById('peepsList').appendChild(PeepsView.peepsList())
    PeepsView.peepsList();
    peeps_button.addEventListener('click', PeepsView.toggleMenu);
    peepsMenu.style.display = "none";
  },

  toggleMenu(){
    console.log ("button pressed");
    if (peepsMenu.style.display === "none"){
      peepsMenu.style.display = "block"
    } else {
      peepsMenu.style.display = "none"
    }
  },

  peepsList(){
    console.log (State.peeps);
    //create the list element:
    var list = document.createElement('ul');

    for (var i=0; i < State.peeps.length; i++) {
      //create the list item
      var item = document.createElement('li');

      //set its contents:
      item.appendChild(document.createTextNode(State.peeps[i].name));

      //add it to the list:
      list.appendChild(item);
    }

    //return the constructed list:
    return list;
  }

}

module.exports = PeepsView;
