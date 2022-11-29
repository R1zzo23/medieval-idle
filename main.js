var empireName = null;
var timeTick = 0;
var food = 0;
var wood = 0;
var stone = 0;
var gold = 0;
var huts = 0;
var prestige = 1;
var hutCost = 10;
var currentPopulation = 0;
var maxPopulation = 0;
var gameText = document.getElementById("gameText");

function advanceTime() {
    timeTick++;
    if (timeTick == 4) { // Intro flavor text
        gameText.innerHTML = 
        "A new empire will be forged by their strong and fearless leader!<br /><br />" 
        + gameText.innerHTML;
    }
    if (timeTick == 8) { // Intro flavor text 2
        gameText.innerHTML = 
        "The fate of " + empireName + " is in your hands!<br /><br />" 
        + gameText.innerHTML;
    }
    if (timeTick == 15 && huts == 0) { // aid player into getting started
        gameText.innerHTML = "An emporer can't run the empire alone. Chop some wood and build a hut!<br /><br />" 
        + gameText.innerHTML;
    }
        
}

function foodClick(number) {
    food += number;
    document.getElementById("foodCount").innerHTML = food;
}

function woodClick(number) {
    wood += number;
    document.getElementById("woodCount").innerHTML = wood;
}

function buyHut(){
    hutCost = Math.floor(10 * Math.pow(1.1,huts));                           //works out the cost of this hut
    if(wood >= hutCost){                                                     //checks that the player can afford the hut
        huts++;                                                              //increases number of huts
        if (huts == 1) {                                                     // explain what huts do for your empire
            gameText.innerHTML = "Huts will attract people to your empire and give them a place to call home.<br /><br />"
            + gameText.innerHTML; 
        }
        maxPopulation += 3;                                                  //increase population limit
    	wood -= hutCost;                                                     //removes the food spent
        document.getElementById('hutCount').innerHTML = huts;                //updates the number of huts for the user
        document.getElementById('woodCount').innerHTML = wood;               //updates the number of wood for the user
        document.getElementById('maxPopulation').innerHTML = maxPopulation;  // update maxPopulation for user
    };
    var nextCost = Math.floor(10 * Math.pow(1.1,huts));                      //works out the cost of the next hut
    document.getElementById('hutCost').innerHTML = nextCost;                 //updates the hut cost for the user
}

window.setInterval(function(){
    foodClick(huts);
    advanceTime();
}, 1000);

function save() {
    console.log("Saving game to local storage...");
    var save = {
        empireName: empireName,
        timeTick: tickTick,
        currentPopulation: currentPopulation,
        maxPopulation: maxPopulation,
        food: food,
        wood: wood,
        stone: stone,
        gold: gold,
        huts: huts,
        prestige: prestige,
        hutCost: hutCost
    }

    localStorage.setItem("savedEmpire",JSON.stringify(save));
    console.log("Save process complete! food = " + food + ", huts = " + huts + ", prestige = " + prestige);
}

function load() {
    var savedGame = JSON.parse(localStorage.getItem("savedEmpire"));

    if (savedGame !== null) {
        if (typeof savedGame.food !== "undefined") food = savedGame.food;
        if (typeof savedGame.wood !== "undefined") wood = savedGame.wood;
        if (typeof savedGame.stone !== "undefined") stone = savedGame.stone;
        if (typeof savedGame.gold !== "undefined") gold = savedGame.gold
        if (typeof savedGame.huts !== "undefined") huts = savedGame.huts;
        if (typeof savedGame.hutCost !== "undefined") hutCost = savedGame.hutCost;
        if (typeof savedGame.empireName !== "undefined") empireName = savedGame.empireName;
        if (typeof savedGame.timeTick !== "undefined") timeTick = savedGame.timeTick;
        if (typeof savedGame.currentPopulation !== "undefined") currentPopulation = savedGame.currentPopulation;
        if (typeof savedGame.maxPopulation !== "undefined") maxPopulation = savedGame.maxPopulation;
        

        console.log("Load process complete! food = " + food + ", huts = " + huts + ", prestige = " + prestige);

        updateDocumentElements();
    }
    else {
        empireName = prompt("Please enter a name for your empire:");
        currentPopulation = 0;
        maxPopulation = 0;
        timeTick = 0;
        food = 0;
        wood = 0;
        stone = 0;
        gold = 0;
        huts = 0;
        hutCost = 10;
        
        updateDocumentElements();
    }
}

function restartGame() {
    localStorage.removeItem("savedEmpire");
    console.log("Save deleted! food = " + food + ", huts = " + huts + ", prestige = " + prestige);
    load();
}

function updateDocumentElements() {
    document.getElementById("currentPopulation").innerHTML = currentPopulation;
    document.getElementById("maxPopulation").innerHTML = maxPopulation;
    document.getElementById("empireName").innerHTML = empireName;
    document.getElementById("foodCount").innerHTML = food;
    document.getElementById("woodCount").innerHTML = wood;
    document.getElementById("stoneCount").innerHTML = stone;
    document.getElementById("hutCount").innerHTML = huts;
    document.getElementById("hutCost").innerHTML = hutCost;
}