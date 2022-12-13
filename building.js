class Building {
    constructor(name, foodCost, woodCost, stoneCost, goldCost, maxFoodCapacity, maxWoodCapacity, maxStoneCapacity, maxGoldCapacity, addPopulation) {
        this.name = name;
        this.foodCost = foodCost;
        this.woodCost = woodCost;
        this.stoneCost = stoneCost;
        this.goldCost = goldCost;
        this.maxFoodCapacity = this.maxFoodCapacity;
        this.maxWoodCapacity = this.maxWoodCapacity;
        this.maxStoneCapacity = this.maxStoneCapacity;
        this.maxGoldCapacity = this.maxGoldCapacity;
        this.addPopulation = addPopulation;
        
        this.purchaseBuilding = (empire) => {
            empire.food -= foodCost;
            empire.wood -= woodCost;
            empire.stone -= stoneCost;
            empire.gold -= goldCost;
            empire.maxFoodCapacity = maxFoodCapacity;
            empire.maxWoodCapacity = maxWoodCapacity;
            empire.maxStoneCapacity = maxStoneCapacity;
            empire.maxGoldCapacity = maxGoldCapacity;
            empire.maxPopulation += addPopulation;
        }
    }
}

class FoodBuilding extends Building {

}