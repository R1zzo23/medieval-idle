class Person {
    constructor(personType) {
        this.type = personType;
        this.foodCost = 0;
        this.woodCost = 0;
        this.stoneCost = 0;
        this.goldCost = 0;

        if (this.type == "Worker") {
            this.foodCost = 10;
            this.woodCost = 3;
            this.stoneCost = 0;
            this.goldCost = 0;
        }

        else if (this.type == "Warrior") {
            this.foodCost = 15;
            this.woodCost = 0;
            this.stoneCost = 1;
            this.goldCost = 3;
        }

        this.knowYourRole = (food, wood, stone, gold) => {
            console.log("I am a proud " + this.type + "! My cost is: " + food + " | " + 
            wood + " | " + stone + " | " + gold + ".");
        };
    }
}

const personType = {
    Worker: "Worker",
    Warrior: "Warrior"
}