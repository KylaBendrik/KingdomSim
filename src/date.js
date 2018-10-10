const State = require('./state');

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const elements = {};
const alerts = {
    3: "It's April! Make sure you seed your fields this month.",
    9: "It's October! Make sure you harvest your fields this month."
}

const DateView = {
    init(date, monthButton, alertElement, MapView, MapUtil) {
        Object.assign(elements, {date, monthButton, alertElement});

        DateView.setDateText(date);

        monthButton.addEventListener('click', () => DateView.nextMonth(MapView, MapUtil));
    },

    nextMonth(MapView, MapUtil) {
        State.currentMonth++;

        if (State.currentMonth === 12){
            State.currentMonth = 0;
            State.currentYear ++;
        }

        //apply points if there is anything in the queue
        DateView.building(MapView);
        DateView.gathering(MapUtil, MapView);
        DateView.farming();

        

        for (peep of State.peeps){
            State.food -= 1;
        }
        
        MapUtil.setFoodText(State.food);
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

    building(MapView){
        const builders = State.findPeepsByJob('builder')
        let buildPoints = 0
        let buildPointsUsed = 0

        for (const builder of builders){
            buildPoints += (10 + Math.floor(builder.buildSkill))
        };

        while (buildPoints > 0 && State.buildingQueue.length > 0){

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

        //level up builders
        for (const builder of builders){
            //A = total points used by all the builders
            //B = total builders assigned
            //C = ridiculous equation (0.0000467346938776LEVEL^2-0.00746510204082LEVEL+0.257418367347)/10
            var c = (((((Math.pow(builder.buildSkill, 2)) * (0.0000467346938776)))-(0.00746510204082 * builder.buildSkill)) + 0.257418367347)/10;
            
            //X = Peep[i] gets this much XP
            builder.buildSkill += (buildPointsUsed/builders.length)*c;
        };
        
    },
    //distance between two points
    distance(x1, x2, y1, y2){
        xDiff = (x2 - x1);
        yDiff = (y2 - y1);
        distance = Math.sqrt((Math.pow(xDiff, 2))+(Math.pow(yDiff, 2)));
        return distance
    },

    //stuff for gathering

    closestTrees(houseRow, houseCol){
        var trees= State.structures.filter(structure => structure.type === 'tree');
        for (const tree of trees){
            tree.distance = DateView.distance(houseRow, tree.originRow, houseCol, tree.originCol);
        }

        trees = trees.sort(function (a, b){
            return a.distance - b.distance;
        });
        return trees;
    },

    gathering(MapUtil, MapView) {
        const gatherers = State.findPeepsByJob('gatherer');
        for (gatherer of gatherers){
            houseNum = gatherer.house;
            houseStructure = State.findStructurebyHouse(houseNum)
            houseCol = houseStructure.originCol;
            houseRow = houseStructure.originRow;
            const trees = DateView.closestTrees(houseRow, houseCol)
            pointsLeft = Math.floor(gatherer.gatherSkill + 10);
            let pointsUsed = 0;
            while (pointsLeft > 0 && trees.length > 0){
                if (pointsLeft >= 5){
                    var tree = trees[0];
                    pointsLeft -= 5;
                    
                    MapView.updateBuilding(tree.structureNum);
                    State.wood += 2;
                    MapUtil.setWoodText(State.wood);
                    trees.splice(0, 1);
                    pointsUsed += 5;
                    console.log (pointsUsed);
                } else {
                    pointsLeft = 0;
                }
                
            }
             //leveling up
             var c = (((((Math.pow(gatherer.gatherSkill, 2)) * (0.0000467346938776)))-(0.00746510204082 * gatherer.gatherSkill)) + 0.257418367347)/10;
                    
             gatherer.gatherSkill += (pointsUsed)*c;
        }
    },

    farming(){
        const farmers = State.findPeepsByJob('farmer');
        console.log (farmers)
        if (State.farmingQueue.length > 0){
            const farms = State.farmingQueue;
            for (farm of farms){
                if (State.currentMonth > 3){
                    MapView.updateBuilding(farm.structure);
                    console.log ('attempting to update')
                }
            }
            //grow farm plots 1- April, May, 2 - June, July, 3- August, September 4 - October
            if (State.currentMonth === 5){
                console.log ('grow all farm plots to farmland_2')
                
            }
            if (State.currentMonth === 7){
                console.log ('grow all farm plots to farmland_3')
            }
            if (State.currentMonth === 9){
                console.log ('grow all farm plots to farmland_4')
            }
        }
    },

    displayAlerts() {
        if (State.currentMonth in alerts) {
            elements.alertElement.textContent = alerts[State.currentMonth];
        } else {
            elements.alertElement.textContent = '';
        }
        if (State.food < (State.peeps.length *2)){
            elements.alertElement.textContent = 'You are very low on food.';
        }
        if (State.food < 0){
            elements.alertElement.textContent = 'Your people have died of starvation. Game Over.';
        }
    },

    setDateText() {
        elements.date.textContent = (MONTHS[State.currentMonth] + ", Year " + State.currentYear);
    }
};

module.exports = DateView;