
const State = require('./state');
//const peepsMenu = document.getElementById(peepsMenu)


const PeepsView = {

  init(peeps_button, peepsMenu){
    peeps_button.addEventListener('click', PeepsView.toggleMenu(peepsMenu))
  },

  toggleMenu(peepsMenu){
    console.log ("button pressed");
    if (peepsMenu.style.display === "none"){
      peepsMenu.style.display = "block"
    } else {
      peepsMenu.style.display = "none"
    }
  }

}

module.exports = PeepsView;
