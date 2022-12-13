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
        this.currentPopulation = 1;
        this.maxPopulation = 1;
        this.warriorCount = 0;
        this.workerCount = 1;

        this.displayData = () => {
            console.log("The Empire of " + this.name + " has resources of " + 
            this.food + " food || " + this.wood + " wood || and " + this.workerCount + " workers" )
        }
    }
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }