//#region Variables
var empireName;
var timeTick = 0;
var food = 0;
var foodLevel = 0;
var wood = 0;
var woodLevel = 0;
var stone = 0;
var stoneLevel = 0;
var gold = 0;
var goldLevel = 0;
var huts = 0;
var armyLevel = 0;
var hutCost = 10;
var currentPopulation = 0;
var maxPopulation = 0;
var idleFollowers = 0;
var warriors = 0;
var workers = 0;
var newFollowerCountdown = 0;
var gameText = document.getElementById("gameText");
var lumberUpgrades = [
    level1 = {
        name: "Lumber Camp",
        foodCost: 100,
        woodCost: 100,
        stoneCost: 0,
        goldCost: 0
    },
    level2 = {
        name: "Lumber Mill",
        foodCost: 150,
        woodCost: 250,
        stoneCost: 50,
        goldCost: 0
    }
];

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

function upgradeWood() {
    var nextUpgrade = lumberUpgrades[woodLevel];
    if (food >= nextUpgrade.foodCost && wood >= nextUpgrade.woodCost && stone >= nextUpgrade.stoneCost && gold >= nextUpgrade.goldCost) {
        woodLevel++;
        food -= nextUpgrade.foodCost;
        wood -= nextUpgrade.woodCost;
        stone -= nextUpgrade.stoneCost;
        gold -= nextUpgrade.goldCost;
        $("#woodLevel").text(woodLevel);
        displayLumberUpgradeInfo();
    }
}

function displayLumberUpgradeInfo() {
    var nextUpgrade = lumberUpgrades[woodLevel];
    var costText = "";
    $("#upgradeWoodBtn").text(nextUpgrade.name);

    if (nextUpgrade.foodCost > 0) 
        costText += nextUpgrade.foodCost + " food";
    if (nextUpgrade.woodCost > 0)
        costText += " | " + nextUpgrade.woodCost + " wood";
    if (nextUpgrade.stoneCost > 0)
        costText += " | " + nextUpgrade.stoneCost + " stone";
    if (nextUpgrade.goldCost > 0)
        costText += " | " + nextUpgrade.goldCost + " gold";

    $("#woodUpgradeCost").text(costText);
    updateDocumentElements();
}

//#endregion

//#region New Follower --> Warrior or Worker
function newFollowerTimer() {
    var random = Math.floor(Math.random() * 10);            // change 10 to whatever max number time to wait for new follower to join
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
        if (armyLevel > 0) {
            $("#followerBecomesWarrior").show();
        }
        else {
            $("#followerBecomesWarrior").hide();
        }
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
        hutCost: hutCost,
        newFollowerCountdown: newFollowerCountdown
    }

    localStorage.setItem("savedEmpire",JSON.stringify(save));
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

        updateDocumentElements();
    }
    else {
        empireName = prompt("Please enter a name for your empire:");
        currentPopulation = 0;
        maxPopulation = 0;
        timeTick = 0;
        food = 1000;
        wood = 2000;
        stone = 1000;
        gold = 1000;
        foodLevel = 0;
        woodLevel = 0;
        stoneLevel = 0;
        goldLevel = 0;
        huts = 0;
        workers = 0;
        warriors = 0;
        hutCost = 10;
        idleFollowers = 0;
        newFollowerCountdown = 0;
        hideOrShowIdleFollowers();
        updateDocumentElements();
    }
    
    displayLumberUpgradeInfo();
}

function restartGame() {
    localStorage.removeItem("savedEmpire");
    gameText.innerHTML = "";
    load();
}

function updateDocumentElements() {
    document.getElementById("currentPopulation").innerHTML = currentPopulation;
    document.getElementById("maxPopulation").innerHTML = maxPopulation;
    document.getElementById("empireName").innerHTML = empireName;
    document.getElementById("foodCount").innerHTML = food;
    document.getElementById("woodCount").innerHTML = wood;
    document.getElementById("stoneCount").innerHTML = stone;
    document.getElementById("goldCount").innerHTML = gold;
    document.getElementById("hutCount").innerHTML = huts;
    document.getElementById("hutCost").innerHTML = hutCost;
    document.getElementById("warriorCount").innerHTML = warriors;
    document.getElementById("workerCount").innerHTML = workers;
    document.getElementById("woodLevel").innerHTML = woodLevel;
}

//#endregion