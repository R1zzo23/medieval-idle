class RandomEncounter {
    constructor(encounterType) {
        this.type = encounterType;
        this.foodDiscovery = 0;
        this.woodDiscovery = 0;
        this.stoneDiscovery = 0;
        this.goldDiscovery = 0;
        this.flavorText = "";

        /*if (this.type == "Discovery") {
            discoveryEncounter();
        }

        else if (this.type == "Hostile") {
            
        }

        else if (this.type == "Friendly") {
            
        }

        else if (this.type == "Neutral") {
            
        }*/

        this.discoveryEncounter = () => {
            var rnd = Math.floor(Math.random() * 3) + 1;
            console.log("discoveryEncounter = " + rnd);
            if (rnd == 1) {
                //random number between 35 and 80 to account for sheep found for food
                this.foodDiscovery = Math.floor(Math.random() * (80 - 35 + 1)) + 35;
                this.foodDiscovery = 0;
                this.woodDiscovery = 0;
                this.stoneDiscovery = 0;
                this.goldDiscovery = 0;
                this.flavorText = "Your workers found a small flock of sheep they were able to use for food.";
            }
            else if (rnd == 2) {
                this.foodDiscovery = 0;
                this.woodDiscovery = 0;
                this.stoneDiscovery = 0;
                //random number between 3 and 12 to account for small sack of gold coins found
                this.goldDiscovery = Math.floor(Math.random() * (12 - 3 +1)) + 3;
                this.flavorText = "A worker found a small sack of gold coins while walking along the wood line.";
            }
            else if (rnd == 3) {
                this.foodDiscovery = 0;
                this.woodDiscovery = 0;
                this.stoneDiscovery = 0;
                this.goldDiscovery = 0;
                this.flavorText = "Didn't discover anything...yet.";
            }
        }
        /*
        this.knowYourRole = (food, wood, stone, gold) => {
            console.log("I am a proud " + this.type + "! My cost is: " + food + " | " + 
            wood + " | " + stone + " | " + gold + ".");
        };*/
    }
}

const encounterType = {
    Hostile: "Hostile",
    Friendly: "Friendly",
    Neutral: "Neutral",
    Discovery: "Discovery"
}