const State = require('./state');

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const elements = {};
const alerts = {
    3: "It's April! Click your empty fields to seed your crops.",
    9: "It's October! Make sure you have enough farmers assigned to harvest your crops!"
}

const DateView = {
    init(date, monthButton, alertElement, MapView, MapUtil) {
        Object.assign(elements, {date, monthButton, alertElement});

        DateView.setDateText(date);

        monthButton.addEventListener('click', () => DateView.nextMonth(MapView, MapUtil));
    },

    nextMonth(MapView, MapUtil) {
         //apply points for all the jobs
        DateView.building(MapView);
        if (State.wood < State.maxWood){
            DateView.gathering(MapUtil, MapView);
            if (State.wood > State.maxWood){
                State.wood = State.maxWood;
            }
        }
        DateView.farming();
        DateView.treesGrow(MapView);

        for (peep of State.peeps){
            State.food -= 1;
        }

        State.currentMonth++;

        if (State.currentMonth === 12){
            State.currentMonth = 0;
            State.currentYear ++;
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
    treesGrow(MapView){
        var trees = State.structures.filter(structure => structure.type === 'tree');
        var saplings = State.structures.filter(structure => structure.type === 'sapling');
        for (const sapling of saplings){
            if (sapling.pointsStart === 12){
                MapView.growTrees(sapling.structureNum);
                sapling.pointsLeft += 1;
                sapling.pointsStart = -1
            }
            sapling.pointsStart += 1;
        }
        for (const tree of trees){
            //if a spot around the tree is empty, place a sapling.
            const y = tree.originRow;
            const x = tree.originCol;
            let rand = Math.floor(Math.random() * 90)
            if (x > 0 && x < 19){
                if (State.map[y][x + 1].foreground === 'nothing' && rand === 0){
                    MapView.addSapling(y, x + 1 );
                }
                if (State.map[y][x - 1].foreground === 'nothing' && rand === 1){
                    MapView.addSapling(y, x - 1 );
                }
            }
            if (y > 0 && y < 11){
                if (State.map[y + 1][x].foreground === 'nothing' && rand === 2){
                    MapView.addSapling(y + 1, x );
                }
                if (State.map[y -1 ][x].foreground === 'nothing' && rand === 3){
                    MapView.addSapling(y - 1, x );
                }
            }
            
            if (tree.pointsStart === 12){
                MapView.growTrees(tree.structureNum);
                tree.pointsLeft += 1;
                tree.pointsStart = -1;
            }
            tree.pointsStart += 1;
            
        }
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
        const treePoints = 8
        for (gatherer of gatherers){
            houseNum = gatherer.house;
            houseStructure = State.findStructurebyHouse(houseNum)
            houseCol = houseStructure.originCol;
            houseRow = houseStructure.originRow;
            const trees = DateView.closestTrees(houseRow, houseCol)
            pointsLeft = Math.floor(gatherer.gatherSkill + 10);
            let pointsUsed = 0;
            while (pointsLeft > 0 && trees.length > 0){
                if (pointsLeft >= treePoints){
                    var tree = trees[0];
                    pointsLeft -= treePoints;
                    
                    MapView.updateBuilding(tree.structureNum);
                    State.wood += tree.pointsLeft;
                    console.log ('got ', tree.pointsLeft, 'wood')
                    MapUtil.setWoodText(State.wood);
                    trees.splice(0, 1);
                    pointsUsed += treePoints;
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
        var pointsLeft = 0;
        var pointsUsed = 0;
        for (farmer of farmers){
            pointsLeft += Math.floor(farmer.farmSkill + 10);
        }

        if (State.farmingQueue.length > 0){
            const farms = State.farmingQueue;
            
            for (farm of farms){
                var plot = State.findStructure(farm.structure);
                console.log ('currentMonth: ', State.currentMonth);
                console.log ('farm.type: ', plot.type)
                if (State.currentMonth === 3 && plot.type === "farmland_1"){
                    console.log ('pointsLeft in April:', pointsLeft);
                    if (pointsLeft < 10){
                        plot.pointsLeft = -1;
                        console.log ('this plot was planted, but will die');
                        
                    } else {
                        pointsLeft -= 10;
                        pointsUsed += 10;
                        console.log ('this plot was planted and go enough points to grow')
                    }
                    MapView.updateBuilding(farm.structure);
                    console.log ('attempting to update; pointsLeft:', pointsLeft)
                }
                if (State.currentMonth > 3 && State.currentMonth < 9 && plot.pointsLeft === 0){
                    console.log ('pointsLeft:', pointsLeft);
                    if (pointsLeft < 5){
                        plot.pointsLeft = -1;
                        console.log ('this plot will die');
                        
                    } else {
                        pointsLeft -= 5;
                        pointsUsed += 5;
                    }
                    MapView.updateBuilding(farm.structure);
                    console.log ('attempting to update; pointsLeft:', pointsLeft)
                }
                if (State.currentMonth === 9 && plot.type === "farmland_4"){
                    console.log ('pointsLeft in October:', pointsLeft);
                    if (pointsLeft < 10){
                        plot.pointsLeft = -1;
                        console.log ('this plot unable to be harvested');
                        
                    } else {
                        pointsLeft -= 10;
                        pointsUsed += 10;
                        console.log ('this plot was harvested. Awesome!')
                        State.food += 25;
                    }
                    
                    MapView.updateBuilding(farm.structure);
                    console.log ('attempting to harvest; pointsLeft:', pointsLeft)
                }
                if (State.currentMonth === 9 && plot.type === 'farmland_dead'){
                    MapView.updateBuilding(farm.structure);
                    console.log ('turning under')
                }
                //level up farmers
                console.log ('points used this month:', pointsUsed);
            }
            for (const farmer of farmers){
                //A = total points used by all the farmers
                //B = total farmers assigned
                //C = ridiculous equation (0.0000467346938776LEVEL^2-0.00746510204082LEVEL+0.257418367347)/10
                var c = (((((Math.pow(farmer.farmSkill, 2)) * (0.0000467346938776)))-(0.00746510204082 * farmer.farmSkill)) + 0.257418367347)/10;
                
                //X = Peep[i] gets this much XP
                farmer.farmSkill += (pointsUsed/farmers.length)*c;
            };
            console.log ('All the Farmers, after they level up', farmers);
        }
    },

    displayAlerts() {
        if (State.currentMonth in alerts) {
            elements.alertElement.textContent = alerts[State.currentMonth];
            window.alert(alerts[State.currentMonth]);
        } else {
            elements.alertElement.textContent = '';
        }
        if (State.food < (State.peeps.length *2)){
            elements.alertElement.textContent = 'You are very low on food.';
        }
        if (State.food < 0){
            elements.alertElement.textContent = 'Your people have died of starvation. Game Over.';
            window.alert('Your people have died of starvation. Game Over.');
        }
    },

    setDateText() {
        elements.date.textContent = (MONTHS[State.currentMonth] + ", Year " + State.currentYear);
    }
};

module.exports = DateView;