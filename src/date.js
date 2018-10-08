const State = require('./state');

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const elements = {};
const alerts = {
    3: "It's April! Make sure you seed your fields this month.",
    9: "It's October! Make sure you harvest your fields this month."
}

const DateView = {
    init(date, monthButton, alertElement) {
        Object.assign(elements, {date, monthButton, alertElement});

        DateView.setDateText(date);

        monthButton.addEventListener('click', DateView.nextMonth);
    },

    nextMonth() {
        State.currentMonth++;

        if (State.currentMonth === 12){
            State.currentMonth = 0;
            State.currentYear ++;
        }

        //apply points
        DateView.applyPoints();

        DateView.setDateText();
        DateView.displayAlerts();
    },

    minBy(values, callback){
        const reducer = ({ minComp, minVal}, val) => {
            const comp = callback(val);

            if (comp < minComp) {
                return {minComp: comp, minVal: val};
            } else {
                return {minComp, minVal};
            }
        };

        return values.reduce(reducer, {
            minComp: callback(values[0]),
            minVal: values[0]
        }).minVal;
    },
    updateQueue(queue){
        for (const item of queue){
            item.QueueOrder --;
        }
        return queue
    },

    applyPoints(){
        const builders = State.findPeepsByJob('builder')
        var buildPoints = 0

        for (const builder of builders){
            buildPoints += (10 + builder.buildSkill);
        };
        console.log(State.buildingQueue);
        console.log('First Item in Queue has this many points left:');

        while (buildPoints > 0){
            firstItem = DateView.minBy(buildingQueue, item => item.QueueOrder)
            firstItemIndex = buildingQueue.indexOf(firstItem);
            
            firstItemStructure = State.findStructure(firstItem.structureNum);
            firstItemPoints = firstItemStructure.pointsLeft;

            if (firstItemPoints <= buildPoints){
                buildPoints -= firstItemPoints;
                //remove item from queue
                State.buildingQueue.splice(firstItemIndex, 1);
                //update queue order
                State.buildingQueue = DateView.updateQueue(buildingQueue);
            }
            if (firstItemPoints > buildPoints){
                firstItemPoints -= buildPoints;
                //update building Queue
                State.buildingQueue[firstItemIndex].pointsLeft = firstItemPoints;
            }
        }
        
    },

    displayAlerts() {
        if (State.currentMonth in alerts) {
            elements.alertElement.textContent = alerts[State.currentMonth];
        } else {
            elements.alertElement.textContent = '';
        }
    },

    setDateText() {
        elements.date.textContent = (MONTHS[State.currentMonth] + ", Year " + State.currentYear);
    }
};

module.exports = DateView;