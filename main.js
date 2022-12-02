//#region Variables
var empireName = null;
var timeTick = 0;
var food = 0;
var foodLevel = 1;
var wood = 0;
var woodLevel = 1;
var stone = 0;
var stoneLevel = 1;
var gold = 0;
var goldLevel = 1;
var huts = 0;
var prestige = 1;
var hutCost = 10;
var currentPopulation = 0;
var maxPopulation = 0;
var idleFollowers = 0;
var warriors = 0;
var workers = 0;
var newFollowerCountdown = 0;
var gameText = document.getElementById("gameText");

//#endregion

//#region Resource Clicks

function foodClick(number) {
    food += number;
    document.getElementById("foodCount").innerHTML = food;
}

function woodClick(number) {
    wood += number;
    document.getElementById("woodCount").innerHTML = wood;
}

//#endregion

//#region Resource Consumption
function calculateFoodConsumption() {
    food -= workers + (warriors * 3);
    $(".foodCount").text(food);
}

//#endregion

//#region Raise Buildings

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

//#endregion

//#region New Follower --> Warrior or Worker
function newFollowerTimer() {
    var random = Math.floor(Math.random() * 10);
    newFollowerCountdown = timeTick + random;
    console.log(timeTick + " --> " + newFollowerCountdown);
}

function newFollower() {
    currentPopulation++;
    idleFollowers++;
    document.getElementById('currentPopulation').innerHTML = currentPopulation;
    gameText.innerHTML = "A new follower has found their way to " + empireName + "!<br /><br />" + gameText.innerHTML;
    newFollowerCountdown = 0;
}

function trainWarrior() {
    console.log("Training warrior.");
    warriors++;
    $("#warriorCount").text(warriors);
    idleFollowers--;
    $("#newFollowerCount").text(idleFollowers);
    hideOrShowIdleFollowers();
}

function trainWorker() {
    console.log("training worker.");
    workers++;
    $("#workerCount").text(workers);
    idleFollowers--;
    $("#newFollowerCount").text(idleFollowers);
    hideOrShowIdleFollowers();
}

function hideOrShowIdleFollowers() {
    if (idleFollowers > 0) {
        $("#newFollowerCount").text(idleFollowers);
        $(".newFollowersRow").show();
    }
    else {
        $(".newFollowersRow").hide();
    }
}

//#endregion

//#region Game Engine

window.setInterval(function(){              // timer that acts as the game engine
    foodClick(workers * (huts + foodLevel));
    advanceTime();
    if (currentPopulation < maxPopulation && newFollowerCountdown == 0) {
        newFollowerTimer();
    }
    if (timeTick == newFollowerCountdown) {
        newFollower();
    }
    hideOrShowIdleFollowers();
    calculateFoodConsumption();
}, 1000);


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

//#endregion

//#region Save - Load - Restart

function save() {
    console.log("Saving game to local storage...");
    var save = {
        empireName: empireName,
        timeTick: timeTick,
        currentPopulation: currentPopulation,
        maxPopulation: maxPopulation,
        warriors: warriors,
        workers: workers,
        food: food,
        foodLevel: foodLevel,
        wood: wood,
        woodLevel, woodLevel,
        stone: stone,
        stoneLevel: stoneLevel,
        gold: gold,
        goldLevel: goldLevel,
        huts: huts,
        prestige: prestige,
        hutCost: hutCost,
        newFollowerCountdown: newFollowerCountdown
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
        if (typeof savedGame.foodLevel !== "undefined") foodLevel = savedGame.foodLevel;
        if (typeof savedGame.woodLevel !== "undefined") woodLevel = savedGame.woodLevel;
        if (typeof savedGame.stoneLevel !== "undefined") stoneLevel = savedGame.stoneLevel;
        if (typeof savedGame.goldLevel !== "undefined") goldLevel = savedGame.goldLevel;
        if (typeof savedGame.huts !== "undefined") huts = savedGame.huts;
        if (typeof savedGame.workers !== "undefined") workers = savedGame.workers
        if (typeof savedGame.warriors !== "undefined") warriors = savedGame.warriors;
        if (typeof savedGame.hutCost !== "undefined") hutCost = savedGame.hutCost;
        if (typeof savedGame.empireName !== "undefined") empireName = savedGame.empireName;
        if (typeof savedGame.timeTick !== "undefined") timeTick = savedGame.timeTick;
        if (typeof savedGame.currentPopulation !== "undefined") currentPopulation = savedGame.currentPopulation;
        if (typeof savedGame.maxPopulation !== "undefined") maxPopulation = savedGame.maxPopulation;
        if (typeof savedGame.newFollowerCountdown !== "undefined") newFollowerCountdown = savedGame.newFollowerCountdown;
        

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
        foodLevel = 1;
        woodLevel = 1;
        stoneLevel = 1;
        goldLevel = 1;
        huts = 0;
        workers = 0;
        warriors = 0;
        hutCost = 10;
        newFollowerCountdown = 0;
        
        updateDocumentElements();
    }
}

function restartGame() {
    localStorage.removeItem("savedEmpire");
    gameText.innerHTML = "";
    console.log("Save deleted! food = " + food + ", huts = " + huts + ", prestige = " + prestige);
    load();
}

function updateDocumentElements() {
    $("#currentPopulation").innerHTML = currentPopulation;
    $("#maxPopulation").innerHTML = maxPopulation;
    $("#empireName").innerHTML = empireName;
    $("#foodCount").innerHTML = food;
    $("#woodCount").innerHTML = wood;
    $("#stoneCount").innerHTML = stone;
    $("#hutCount").innerHTML = huts;
    $("#hutCost").innerHTML = hutCost;
    $("#warriorCount").text(warriors);
    $("#workerCount").text(workers);
}

//#endregion