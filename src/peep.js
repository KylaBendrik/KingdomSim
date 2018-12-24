
const State = require('./state');

const PeepsView = {

  init(peeps_button, peepsMenu){
    document.getElementById('peepsList').appendChild(PeepsView.peepsList())
    peeps_button.addEventListener('click', PeepsView.toggleMenu);
    peepsMenu.style.display = "none";
  },

  toggleMenu(){
    console.log ("button pressed");
    let list = document.getElementById('peepsList')

    if (peepsMenu.style.display === "none"){
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
  
      list.appendChild(PeepsView.peepsList())

      peepsMenu.style.display = "block"
    } else {
      peepsMenu.style.display = "none"
    }
  },

  peepsList(){
    //create the list element:
    var list = document.createElement('table');
    console.log(list);
    list.setAttribute("id", "peepsTable");

    for (var i=0; i < State.peeps.length; i++) {
      //create the list item (insertRow()?)
      var row = document.createElement('tr');

      //name
      var cell1 = document.createElement("td");
      var name = document.createTextNode(State.peeps[i].name)

      cell1.appendChild(name);
      row.appendChild(cell1);

      //job
      var cell2 = document.createElement("td");
      var job = document.createTextNode(State.peeps[i].job)

      cell2.appendChild(job);
      row.appendChild(cell2);

      //age
      var cell3 = document.createElement("td");
      var age = document.createTextNode(State.peeps[i].age)

      cell3.appendChild(age);
      row.appendChild(cell3);

      //add it to the list:
      list.appendChild(row);
    }

    //return the constructed list:
    return list;
  }

}

module.exports = PeepsView;
