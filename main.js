var empireName = null;
var food = 0;
var wood = 0;
var stone = 0;
var huts = 0;
var prestige = 1;
var hutCost = 10;
var currentPopulation = 0;
var maxPopulation = 0;

function foodClick(number) {
    food += number;
    document.getElementById("foodCount").innerHTML = food;
}

function buyHut(){
    hutCost = Math.floor(10 * Math.pow(1.1,huts));               //works out the cost of this cursor
    if(food >= hutCost){                                         //checks that the player can afford the cursor
        huts++;                                                  //increases number of cursors
    	food -= hutCost;                                         //removes the food spent
        document.getElementById('hutCount').innerHTML = huts;    //updates the number of cursors for the user
        document.getElementById('foodCount').innerHTML = food;   //updates the number of food for the user
    };
    var nextCost = Math.floor(10 * Math.pow(1.1,huts));          //works out the cost of the next cursor
    document.getElementById('hutCost').innerHTML = nextCost;     //updates the cursor cost for the user
}

window.setInterval(function(){
    foodClick(huts);
}, 1000);

function save() {
    console.log("Saving game to local storage...");
    var save = {
        empireName: empireName,
        food: food,
        wood: wood,
        stone: stone,
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
        if (typeof savedGame.wood !== "undefined") food = savedGame.wood;
        if (typeof savedGame.stone !== "undefined") food = savedGame.stone;
        if (typeof savedGame.huts !== "undefined") huts = savedGame.huts;
        if (typeof savedGame.prestige !== "undefined") prestige = savedGame.prestige;
        if (typeof savedGame.hutCost !== "undefined") hutCost = savedGame.hutCost;
        if (typeof savedGame.empireName !== "undefined") empireName = savedGame.empireName;
        if (typeof savedGame.currentPopulation !== "undefined") currentPopulation = savedGame.currentPopulation;
        if (typeof savedGame.maxPopulation !== "undefined") maxPopulation = savedGame.maxPopulation;
        

        console.log("Load process complete! food = " + food + ", huts = " + huts + ", prestige = " + prestige);

        updateDocumentElements();
    }
    else {
        empireName = prompt("Please enter a name for your empire:");
        currentPopulation = 0;
        maxPopulation = 0;
        food = 0;
        wood = 0;
        stone = 0;
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