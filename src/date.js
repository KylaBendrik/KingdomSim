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

        console.log ('buildingQueue length outside of apply points: ', State.buildingQueue.length);

        //apply points if there is anything in the queue
        DateView.building(MapView);

        DateView.gathering(MapUtil);

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

        console.log ('Build Points used this month', buildPointsUsed);

        //level up builders
        for (const builder of builders){
            console.log (builder.name, 'Build Skill:', builder.buildSkill);
            console.log (builder);
            
            //A = total points used by all the builders
            console.log ('A = ', buildPointsUsed)
            //B = total builders assigned
            console.log ('B = ', builders.length)
            
            //C = ridiculous equation (0.0000467346938776LEVEL^2-0.00746510204082LEVEL+0.257418367347)/10
            var c = (((((Math.pow(builder.buildSkill, 2)) * (0.0000467346938776)))-(0.00746510204082 * builder.buildSkill)) + 0.257418367347)/10;
            console.log ('C = ', c)
            
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
        
        console.log ('trees: ', trees)
        return trees;
    },

    gathering(MapUtil) {
        const gatherers = State.findPeepsByJob('gatherer');
        for (gatherer of gatherers){
            houseNum = gatherer.house;
            houseStructure = State.findStructurebyHouse(houseNum)
            
            console.log (gatherer);
            
            console.log (houseStructure)
            houseCol = houseStructure.originCol;
            houseRow = houseStructure.originRow;
            console.log (houseRow, houseCol)
            const trees = DateView.closestTrees(houseRow, houseCol)
            pointsLeft = gatherer.gatherSkill + 10;
            while (pointsLeft > 0 && trees.length > 0){
                if (pointsLeft >= 5){
                    var tree = trees[0];
                    pointsLeft -= 5;
                    console.log ('tree to be deleted:', tree);
                    
                    MapView.updateBuilding(tree.structureNum);
                    State.wood += 3;
                    MapUtil.setWoodText(State.wood);
                    trees.splice(0, 1);
                }
                console.log ('pointsLeft: ', pointsLeft);
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