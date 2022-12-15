class Empire {
    constructor(name){
        this.name = name;
        this.food = randomIntFromInterval(10, 100);
        this.wood = randomIntFromInterval(10,50);
        this.stone = 0;
        this.gold = 0;
        this.foodLevel = 0;
        this.woodLevel = 0;
        this.miningLevel = 0;
        this.armyLevel = 0;
        this.currentPopulation = 0;
        this.maxPopulation = 0;
        this.idleFollowers = 0;
        this.warriors = 0;
        this.workers = 0;
        this.huts = 0;
        this.hutCost = 10;
        this.maxFoodCapacity = 100;
        this.maxWoodCapacity = 100;
        this.maxStoneCapacity = 0;
        this.maxGoldCapacity = 0;

        this.displayData = () => {
            console.log("The Empire of " + this.name + " has resources of " + 
            this.food + " food || " + this.wood + " wood || and " + this.workerCount + " workers" )
        }
    }
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }