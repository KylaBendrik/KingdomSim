const State = require('./state');

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const elements = {};
const alerts = {
    3: "It's April! Make sure you seed your fields this month.",
    9: "It's October! Make sure you harvest your fields this month."
}

const DateView = {
    init(date, monthButton, alertElement, MapView) {
        Object.assign(elements, {date, monthButton, alertElement});

        DateView.setDateText(date);

        monthButton.addEventListener('click', () => DateView.nextMonth(MapView));
    },

    nextMonth(MapView) {
        State.currentMonth++;

        if (State.currentMonth === 12){
            State.currentMonth = 0;
            State.currentYear ++;
        }

        //apply points if there is anything in the queue
        if (State.buildingQueue.length > 0){
            console.log ('buildingQueue length at beginning: ', State.buildingQueue.length);
            
            console.log ('buildingQueue: at beginning', State.buildingQueue);
            DateView.applyPoints(MapView);
            console.log ('buildingQueue length at end of month: ', State.buildingQueue.length);
            console.log ('buildingQueue: at end', State.buildingQueue);
        }
        //DateView.gathering();

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

    applyPoints(MapView){
        const builders = State.findPeepsByJob('builder')
        let buildPoints = 0
        let buildPointsUsed = 0

        for (const builder of builders){
            buildPoints += (10 + builder.buildSkill);
        };

        while (buildPoints > 0){

            firstItem = DateView.minBy(State.buildingQueue, item => item.QueueOrder)
            firstItemIndex = State.buildingQueue.indexOf(firstItem);
            
            firstItemStructure = State.findStructure(firstItem.structure);
            firstItemPoints = firstItemStructure.pointsLeft;

            if (firstItemPoints <= buildPoints){
                buildPoints -= firstItemPoints;
                
                //count how many points are used this month
                buildPointsUsed += firstItemPoints;

                //update structure list
                firstItemStructure.pointsLeft = firstItemPoints;
                //update structure_con to finished version. (how to handle multiple kinds of construction?)
                MapView.updateBuilding(firstItemStructure.structureNum);
                //remove item from queue
                State.buildingQueue.splice(firstItemIndex, 1);
                //update queue order
                if (State.buildingQueue.length > 0){
                    State.buildingQueue = DateView.updateQueue(State.buildingQueue);
                }
            }
            if (firstItemPoints > buildPoints){
                firstItemPoints -= buildPoints;
                
                //count how many points are used this month
                buildPointsUsed += buildPoints;

                buildPoints = 0;
                //update structure list
                firstItemStructure.pointsLeft = firstItemPoints;
            }
        }

        console.log ('Build Points used this month', buildPointsUsed);

        //level up builders
        //A = total points used by all the builders
        //B = total builders assigned
        //C = ridiculous equation (0.0000467346938776LEVEL^2-0.00746510204082LEVEL+0.257418367347)/10
        //X = Peep[i] gets this much XP
        
    },
    // distance(x1, x2, y1, y2){
        
    // },

    // closestTrees(originRow, originCol){
    //     var trees = [], i = -1;
    //     for(i=0; i < State.structures.length; i++){
    //         if (State.structures[i].type === 'tree'){
    //             trees.push(State.structures[i]);
    //         }
    //     }
    //     return trees;
    // },

    // gathering() {
    //     const gatherers = State.findPeepsByJob('gatherer');
    //     for (gatherer of gatherers){
    //         houseNum = gatherer.house;
            
    //         console.log (gatherer);
    //         houseX = State.findMapCoordsByHouse(houseNum).x;
    //         houseY = State.findMapCoordsByHouse(houseNum).y;
    //         console.log (houseX, houseY)
    //     }
    // },

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