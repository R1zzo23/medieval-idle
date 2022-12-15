//#region Variables
//window.empireName;
window.timeTick = 0;
var userEmpire;
var empire1;
var empire2;
var empire3;
var eatingTimer = 8;                                                                //everyone eats 3 times per day
var nightFireTimer = 24;                                                            //all living spaces need fire at night
//var food = 0;
var foodCooldown = 5;
var foodTimer = 0;
//var foodLevel = 0;
var foodEmoji = "&#129385;";
//var maxFoodCapacity = 100;
//window.wood = 0;
var woodCooldown = 5;
var woodTimer = 0;
//var woodLevel = 0;
var woodEmoji = "&#129717;";
//var maxWoodCapacity = 100;
//var miningLevel = 0;
//var stone = 0;
var stoneTimer = 0;
var stoneCooldown = 5;
var stoneEmoji = "&#129704;";
//var maxStoneCapacity = 0;
//var gold = 0;
var goldTimer = 0;
var goldCooldown = 5;
var goldEmoji = "";
//var maxGoldCapacity = 0;
//var userEmpire.huts = 0;
//var armyLevel = 0;
//var hutCost = 10;
//var currentPopulation = 0;
//var maxPopulation = 0;
//var userEmpire.idleFollowers = 0;
//var warriors = 0;
//var workers = 0;
var newFollowerCountdown = 0;
var gameText = document.getElementById('gameText');
var foodUpgrades = [
    level1 = new Building("Small Silo", 100, 50, 0, 0, 250, 0, 0, 0, 0),
    level2 = new Building("Bunker", 200, 100, 10, 0, 400, 0, 0, 0, 0),
    level3 = new Building("Large Silo", 300, 125, 60, 0, 650, 0, 0, 0, 0) 
];
var lumberUpgrades = [
    level1 = new Building("Lumber Camp", 100, 75, 0, 0, 0, 250, 0, 0, 0),
    level2 = new Building("Lumber Mill", 250, 250, 50, 0, 0, 400, 0, 0, 0)
];
var armyUpgrades = [
    level1 = new Building("Garrison", 150, 150, 50, 0, 0, 0, 0, 0, 0),
    level2 = new Building("Barracks", 200, 250, 100, 25, 0, 0, 0, 0, 0)
];
var miningUpgrades = [
    level1 = new Building("Small Mine", 95, 175, 0, 0, 0, 0, 100, 50, 0),
    level2 = new Building("Large Mine", 275, 350, 90, 40, 0, 0, 250, 125, 0)
];

//#endregion

//#region Resource Clicks

function manualClick(resource) {                                                //clicked on resrouce button
    if (resource == "food") {                                                   //food click
        foodTimer = foodCooldown;                                               //set cooldown for food button
        foodClick();                                                            //run food click
    }
    else if (resource == "wood") {                                              //wood click
        woodTimer = woodCooldown;                                               //set cooldown for wood button
        woodClick();                                                            //run wood click
    }
    else if (resource == "stone") {                                             //stone click   
        stoneTimer = stoneCooldown;                                             //set cooldown for stone button
        stoneClick();                                                           //run stone click
    }
    else if (resource == "gold") {                                              //gold click
        goldTimer = goldCooldown;                                               //set cooldown for gold button
        goldClick();                                                            //run gold click
    }
    activateUpgradeButtons();
}

function foodClick() {
    var foodAdded = (userEmpire.workers * (1 + (Math.floor(userEmpire.huts * .25) + userEmpire.foodLevel))) * 10;//calculate food added
    if (foodAdded == 0) foodAdded = userEmpire.workers + 1;                                //make sure to add something
    userEmpire.food += foodAdded;                                                          //add food to current stash
    if (userEmpire.food > userEmpire.maxFoodCapacity) userEmpire.food = userEmpire.maxFoodCapacity;                         //cannot exceed capacity
    $("#foodCount").text(userEmpire.food);                                                 //update amount of food to user
    $('#foodClickBtn').prop('disabled', true);                                  //disable button until cooldown
}

function woodClick() {
    var woodAdded = (userEmpire.workers * (1 + userEmpire.woodLevel)) * 7;                            //add 1 wood --> needs to calculation
    userEmpire.wood += woodAdded;                                                          //add wood to stash
    if (userEmpire.wood > userEmpire.maxWoodCapacity) userEmpire.wood = userEmpire.maxWoodCapacity;                         //cannot exceed capacity
    $('#woodClickBtn').prop('disabled', true);                                  //disable button until cooldown
    $('#woodCount').text(userEmpire.wood);                                                 //dupdate amount of wood to user
    canAffordNextHut();
}

function stoneClick() {
    userEmpire.stone += 100;
    //userEmpire.stone += Math.round(userEmpire.workers / 3);
    $('#stoneCount').text(userEmpire.stone);
    $('#stoneClickBtn').prop('disabled', true);                                 //disable button until cooldown
}

function goldClick() {
    userEmpire.gold += 100;
    userEmpire.gold += Math.round(userEmpire.workers / 5);
    $('#goldCount').text(userEmpire.gold);
    $('#goldClickBtn').prop('disabled', true);                                  //disable button until cooldown
}

//#endregion

//#region Resource Consumption
function calculateFoodConsumption() {
    userEmpire.food -= userEmpire.workers + (userEmpire.warriors * 3);                                           //remove food from stash
    $("#foodCount").text(userEmpire.food);                                                 //update amouhnt of food to user
    activateUpgradeButtons()
}

function calculateFireWoodUsage() {
    var woodUsage = 0;
    woodUsage += userEmpire.huts * 3;
    woodUsage += userEmpire.armyLevel * 5;
    userEmpire.wood -= woodUsage;
    $("#woodCount").text(userEmpire.wood);
    activateUpgradeButtons();
}

//#endregion

//#region Raise Buildings

function buyHut(){
    
    if (userEmpire.huts == 0) 
        userEmpire.hutCost = 10;                                                           //first hut cost 10 wood
    else 
        userEmpire.hutCost = Math.floor(25 * Math.pow(1.1,userEmpire.huts));                          //works out the cost of this hut
    if(userEmpire.wood >= userEmpire.hutCost){                                                        //checks that the player can afford the hut
        userEmpire.huts++;                                                                 //increases number of userEmpire.huts
        if (userEmpire.huts == 1) {                                                        //explain what userEmpire.huts do for your empire
            document.getElementById('gameText').innerHTML = "Huts will attract people to your empire and give them a place to call home.<br /><br />"
            + document.getElementById('gameText').innerHTML; 
        }
        userEmpire.maxPopulation += 3;                                                     //increase population limit
    	userEmpire.wood -= userEmpire.hutCost;                                                        //removes the food spent
        $('#hutCount').text(userEmpire.huts);                                              //updates the number of userEmpire.huts for the user
        $('#woodCount').text(userEmpire.wood);                                             //updates the number of wood for the user
        $('#maxPopulation').text(userEmpire.maxPopulation);                                //update maxPopulation for user
    };
    var nextCost = Math.floor(25 * Math.pow(1.1,userEmpire.huts));                         //works out the cost of the next hut
    $('#hutCost').text(nextCost);                                               //updates the hut cost for the user
    userEmpire.hutCost = nextCost;
    canAffordNextHut();
}

function purchaseUpgrade(nextUpgrade) {                                         //removes resources after buying upgrade
    userEmpire.food -= nextUpgrade.foodCost;                                       
    userEmpire.wood -= nextUpgrade.woodCost;
    userEmpire.stone -= nextUpgrade.stoneCost;
    userEmpire.gold -= nextUpgrade.goldCost;
}

function displayNextUpgradeCost(nextUpgrade) {                                  //shows user cost for upgrades
    var costText = "";
    if (nextUpgrade.foodCost > 0) 
        costText += nextUpgrade.foodCost + " food";
    if (nextUpgrade.woodCost > 0)
        costText += " | " + nextUpgrade.woodCost + " wood";
    if (nextUpgrade.stoneCost > 0)
        costText += " | " + nextUpgrade.stoneCost + " stone";
    if (nextUpgrade.goldCost > 0)
        costText += " | " + nextUpgrade.goldCost + " gold";

    return costText;
}

function upgradeFood() {                                                        //lumber upgrade
    var nextUpgrade = foodUpgrades[userEmpire.foodLevel];                                  //determine what the next upgrade is in array
    if (userEmpire.food >= nextUpgrade.foodCost && userEmpire.wood >= nextUpgrade.woodCost &&         //make sure user has all needed resources
    userEmpire.stone >= nextUpgrade.stoneCost && userEmpire.gold >= nextUpgrade.goldCost) {
        userEmpire.foodLevel++;                                                            //increase woodLevel after upgrade
        purchaseUpgrade(nextUpgrade);                                           //complete purchase
        $("#foodLevel").text(userEmpire.foodLevel);                                        //update wood level to user
        displayFoodUpgradeInfo();                                               //show user new upgrade available
        userEmpire.maxFoodCapacity = nextUpgrade.maxCapacity;                              //update max capacity for this resource

    }
}

function activateUpgradeButtons() {
    if (userEmpire.foodLevel < foodUpgrades.length && canAffordUpgrade(foodUpgrades[userEmpire.foodLevel]))
        $("#upgradeFoodBtn").prop('disabled', false);
    else $("#upgradeFoodBtn").prop('disabled', true);
    if (userEmpire.woodLevel < lumberUpgrades.length && canAffordUpgrade(lumberUpgrades[userEmpire.woodLevel]))
        $("#upgradeWoodBtn").prop('disabled', false);
    else $("#upgradeWoodBtn").prop('disabled', true);
    if (userEmpire.miningLevel < miningUpgrades.length && canAffordUpgrade(miningUpgrades[userEmpire.miningLevel]))
        $("#upgradeMiningBtn").prop('disabled', false);
    else $("#upgradeMiningBtn").prop('disabled', true);
    if (userEmpire.armyLevel < armyUpgrades.length && canAffordUpgrade(armyUpgrades[userEmpire.armyLevel]))
        $("#upgradeArmyBtn").prop('disabled', false);
    else $("#upgradeArmyBtn").prop('disabled', true);
    canAffordNextHut();
}

function canAffordNextHut() {
    if (userEmpire.wood >= userEmpire.hutCost)
        $('#buyHutBtn').prop('disabled', false);
    else $('#buyHutBtn').prop('disabled', true);
}

function canAffordUpgrade(nextUpgrade) {
    if (userEmpire.food >= nextUpgrade.foodCost && userEmpire.wood >= 
        nextUpgrade.woodCost && userEmpire.stone >= nextUpgrade.stoneCost &&
        userEmpire.gold >= nextUpgrade.goldCost) {
            return true;
        }
    else return false;
}
function displayFoodUpgradeInfo() {                                             //show user new upgrade available
    if (userEmpire.foodLevel < foodUpgrades.length) {                                      //check for another upgrade available
        var nextUpgrade = foodUpgrades[userEmpire.foodLevel];                              //assign next upgrade from array
        var costText = displayNextUpgradeCost(nextUpgrade);                     //determine cost of next upgrade
        $("#upgradeFoodBtn").text(nextUpgrade.name);                            //give button name of next upgrade as text
        $("#foodUpgradeCost").text(costText);                                   //display cost of next upgrade to user
        updateDocumentElements();                                               //update document for user
    }
    else {
        $("#upgradeFoodBtn").prop('disabled', true);                            //disable button if no upgrade available
        $("#foodUpgradeCost").text("No more food upgrades.");                   //tell user no available upgrades
    }
}

function upgradeWood() {                                                        //lumber upgrade
    var nextUpgrade = lumberUpgrades[userEmpire.woodLevel];                                //determine what the next upgrade is in array
    if (userEmpire.food >= nextUpgrade.foodCost && userEmpire.wood >= nextUpgrade.woodCost &&         //make sure user has all needed resources
    userEmpire.stone >= nextUpgrade.stoneCost && userEmpire.gold >= nextUpgrade.goldCost) {
        userEmpire.woodLevel++;                                                            //increase woodLevel after upgrade
        purchaseUpgrade(nextUpgrade);                                           //complete purchase
        $("#woodLevel").text(userEmpire.woodLevel);                                        //update wood level to user
        displayLumberUpgradeInfo();                                             //show user new upgrade available
        userEmpire.maxWoodCapacity = nextUpgrade.maxCapacity                               //update max capacity for this resource
    }
}

function displayLumberUpgradeInfo() {                                           //show user new upgrade available
    if (userEmpire.woodLevel < lumberUpgrades.length) {                                    //check for another upgrade available
        var nextUpgrade = lumberUpgrades[userEmpire.woodLevel];                            //assign next upgrade from array
        var costText = displayNextUpgradeCost(nextUpgrade);                     //determine cost of next upgrade
        $("#upgradeWoodBtn").text(nextUpgrade.name);                            //give button name of next upgrade as text
        $("#woodUpgradeCost").text(costText);                                   //display cost of next upgrade to user
        updateDocumentElements();                                               //update document for user
    }
    else {
        $("#upgradeWoodBtn").prop('disabled', true);                            //disable button if no upgrade available
        $("#woodUpgradeCost").text("No more lumber upgrades.");                 //tell user no available upgrades
    }
}

function upgradeMining() {                                                      //mining upgrade
    var nextUpgrade = miningUpgrades[userEmpire.miningLevel];                              //determine what the next upgrade is in array
    if (userEmpire.food >= nextUpgrade.foodCost && userEmpire.wood >= nextUpgrade.woodCost &&         //make sure user has all needed resources
    userEmpire.stone >= nextUpgrade.stoneCost && userEmpire.gold >= nextUpgrade.goldCost) {
        userEmpire.miningLevel++;                                                          //increase miningLevel after upgrade
        purchaseUpgrade(nextUpgrade);                                           //complete purchase
        $("#miningLevel").text(userEmpire.miningLevel);                                    //update mining level to user
        displayMiningUpgradeInfo();                                             //show user new upgrade available
        userEmpire.maxFoodCapacity = nextUpgrade.maxCapacity;                              //update max capacity for this resource
    }
}

function displayMiningUpgradeInfo() {                                           //show user new upgrade available
    if (userEmpire.miningLevel < miningUpgrades.length) {                                  //check for another upgrade available
        var nextUpgrade = miningUpgrades[userEmpire.miningLevel];                          //assign next upgrade from array
        var costText = displayNextUpgradeCost(nextUpgrade);                     //determine cost of next upgrade
        $("#upgradeMiningBtn").text(nextUpgrade.name);                          //give button name of next upgrade as text
        $("#miningUpgradeCost").text(costText);                                 //display cost of next upgrade to user
        updateDocumentElements();                                               //update document for user
    }
    else {
        $("#upgradeMiningBtn").prop('disabled', true);                          //disable button if no upgrade available
        $("#miningUpgradeCost").text("No more mining upgrades.");               //tell user no available upgrades
    }
    if (userEmpire.miningLevel == 0) {
        $('#stoneClickBtn').prop('disabled', true);
        $('#goldClickBtn').prop('disabled', true);
    }
    else if (userEmpire.miningLevel > 0) {
        $('#stoneClickBtn').prop('disabled', false);
        $('#goldClickBtn').prop('disabled', false);
    }
}

function upgradeArmy() {                                                        //army upgrade
    var nextUpgrade = armyUpgrades[userEmpire.armyLevel];                                  //determine what the next upgrade is in array
    if (userEmpire.food >= nextUpgrade.foodCost && userEmpire.wood >= nextUpgrade.woodCost && 
        userEmpire.stone >= nextUpgrade.stoneCost && userEmpire.gold >= nextUpgrade.goldCost) {       
            userEmpire.armyLevel++;                                                            //increase armyLevel after upgrade
        purchaseUpgrade(nextUpgrade);                                           //complete purchase
        $("#armyLevel").text(userEmpire.armyLevel);                                        //update army level to user
        displayArmyUpgradeInfo();                                               //show user new upgrade available
    }
}

function displayArmyUpgradeInfo() {                                             //show user new upgrade available
    if (userEmpire.armyLevel < armyUpgrades.length) {                                      //check for another upgrade available
        var nextUpgrade = armyUpgrades[userEmpire.armyLevel];                              //assign next upgrade from array
        var costText = displayNextUpgradeCost(nextUpgrade);                     //determine cost of next upgrade
        $("#upgradeArmyBtn").text(nextUpgrade.name);                            //give button name of next upgrade as text
        $("#armyUpgradeCost").text(costText);                                   //display cost of next upgrade to user
        updateDocumentElements();                                               //update docoument for user
    }
    else {
        $("#upgradeArmyBtn").prop('disabled', true);                            //disable button if no upgrade available
        $("#armyUpgradeCost").text("No more army upgrades.");                   //tell user no available upgrades
    }
}

//#endregion

//#region New Follower --> Warrior or Worker
function newFollowerTimer() {                                                   //create timer for new follower to join
    var random = Math.floor(Math.random() * 10);                                //random number between 1 and 10
    newFollowerCountdown = timeTick + random;                                   //set time for new follower
}

function newFollower() {                                                        //create new follower
    userEmpire.currentPopulation++;                                                        //add new follower to population   
    userEmpire.idleFollowers++;                                                            //new follower is idle until trained
    $('#currentPopulation').text(userEmpire.currentPopulation);                            //show user new population status
    document.getElementById('gameText').innerHTML = "A new follower has found their way to "               //add game text to tell user new follower joined
    + userEmpire.name + "!<br /><br />" + document.getElementById('gameText').innerHTML;
    newFollowerCountdown = 0;                                                   //set countdown to 0 to reset process
}

function trainWarrior() {                                                       //idle follower trains to become warrior
    userEmpire.warriors++;                                                                 //add 1 to warrior count
    if (userEmpire.warriors == 1) {                                                        //explain what warriors do for your empire
        document.getElementById('gameText').innerHTML = "Warriors provide much more protection for " +
        "the empire while consuming more food than workers.<br /><br />"
        + document.getElementById('gameText').innerHTML; 
    }
    $("#warriorCount").text(userEmpire.warriors);                                          //update warrior count to user
    userEmpire.idleFollowers--;                                                            //remove an idle follower
    $("#newFollowerCount").text(userEmpire.idleFollowers);                                 //update new follower count to user
    hideOrShowIdleFollowers();                                                  //decide if idle follower row should be hidden
}

function trainWorker() {                                                        //idle follower trains to become worker
    userEmpire.workers++;                                                                  //add 1 to worker count
    $("#workerCount").text(userEmpire.workers);                                            //update worker count to user
    userEmpire.idleFollowers--;                                                            //remove an idle follower
    $("#newFollowerCount").text(userEmpire.idleFollowers);                                 //update new follower count to user
    hideOrShowIdleFollowers();                                                  //decide if idle follower row should be hidden
}

function hideOrShowIdleFollowers() {                                            //decide if idle follower row should be hidden
    if (userEmpire.idleFollowers > 0) {                                                    //if there are idle followers --> show row
        $("#newFollowerCount").text(userEmpire.idleFollowers);
        $(".newFollowersRow").show();
        if (userEmpire.armyLevel > 0) {                                                    //if army level > 0, allow training of warriors
            $("#followerBecomesWarrior").show();
        }
        else {                                                                  //if army level = 0, can't train warriors
            $("#followerBecomesWarrior").hide();
        }
    }
    else {
        $(".newFollowersRow").hide();                                           //no idle followers --> hide row
    }
}

//#endregion

//#region Game Engine

window.setInterval(function(){                                                  //timer that acts as the game engine
    advanceTime();                                                              //timer clicks every second
    if (userEmpire.currentPopulation < userEmpire.maxPopulation && newFollowerCountdown == 0) {       //determine if empire has space for new follower
        newFollowerTimer();                                                     //set timer for new follower to join
    }
    if (timeTick == newFollowerCountdown) {                                     //check if it is time to add new follower
        newFollower();                                                          //run new follower function
    }
    hideOrShowIdleFollowers();                                                  //decide to hide or show new follower section
    eatingTimer--;
    if (eatingTimer == 0) {
        calculateFoodConsumption();                                             //determine how much food is consumed
        eatingTimer = 8;
    }
    nightFireTimer--;
    if (nightFireTimer == 0) {
        calculateFireWoodUsage();
        nightFireTimer = 24;
    }
}, 1000);                                                                       //1000 = 1 second


function advanceTime() {
    timeTick++;                                                                 //advance time in universe
    foodTimer--;                                                                //decrement food timer
    woodTimer--;                                                                //decrement wood timer
    stoneTimer--;                                                               //decrement stone timer
    goldTimer--;                                                                //decrement gold timer
    if (timeTick == 4) {                                                        //Intro flavor text
        document.getElementById('gameText').innerHTML = "A new empire will be forged by their strong and " 
        + "fearless leader!<br /><br />" 
        + document.getElementById('gameText').innerHTML;
    }
    if (timeTick == 8) {                                                        //Intro flavor text 2
        document.getElementById('gameText').innerHTML = 
        "The fate of " + empireName + " is in your hands!<br /><br />" 
        + document.getElementById('gameText').innerHTML;
    }
    if (timeTick == 50) {
        var dragonRoar = new Audio();
        dragonRoar.src = 'dragon-roar.mp3';
        dragonRoar.play();
        document.getElementById('gameText').innerHTML = "The sound of a ferocious and massive dragon " 
        + "can be heard off in the distance.<br /><br />" + document.getElementById('gameText').innerHTML; 
    }
    if (timeTick == 15 && userEmpire.huts == 0) {                                          //aid player into getting started
        document.getElementById('gameText').innerHTML = "An emperor can't run the empire alone. Chop some wood and build a hut!<br /><br />" 
        + document.getElementById('gameText').innerHTML;
    }
    if (foodTimer > 0) $("#foodClickBtn").prop('disabled', true);               //disable food button if not cooled down
    else $("#foodClickBtn").prop('disabled', false);
    if (woodTimer > 0) $("#woodClickBtn").prop('disabled', true);               //disable wood button if not cooled down
    else $("#woodClickBtn").prop('disabled', false);
    if (stoneTimer > 0 || userEmpire.miningLevel == 0) $("#stoneClickBtn").prop('disabled', true);             //disable stone button if not cooled down
    else $("#stoneClickBtn").prop('disabled', false);
    if (goldTimer > 0 || userEmpire.miningLevel == 0) $("#goldClickBtn").prop('disabled', true);               //disable gold button if not cooled down
    else $("#goldClickBtn").prop('disabled', false);
}

//#endregion

//#region Save - Load - Restart

function save() {                                                               //save game into local storage
    var save = {                                                                //save all game info into object
        empireName: userEmpire.name,
        timeTick: timeTick,
        currentPopulation: userEmpire.currentPopulation,
        maxPopulation: userEmpire.maxPopulation,
        warriors: userEmpire.warriors,
        workers: userEmpire.workers,
        food: userEmpire.food,
        foodLevel: userEmpire.foodLevel,
        wood: userEmpire.wood,
        woodLevel: userEmpire.woodLevel,
        stone: userEmpire.stone,
        miningLevel: userEmpire.miningLevel,
        gold: userEmpire.gold,
        maxFoodCapacity: userEmpire.maxFoodCapacity,
        maxWoodCapacity: userEmpire.maxWoodCapacity,
        maxStoneCapacity: userEmpire.maxStoneCapacity,
        maxGoldCapacity: userEmpire.maxGoldCapacity,
        armyLevel: userEmpire.armyLevel,
        userEmpireHuts: userEmpire.huts,
        hutCost: userEmpire.hutCost,
        newFollowerCountdown: newFollowerCountdown
    }
    localStorage.setItem("savedEmpire",JSON.stringify(save));                   //change save game into JSON for local storage
}

function load() {                                                               //load game from local storage
    
    var savedGame = JSON.parse(localStorage.getItem("savedEmpire"));            //change JSON to object

    if (savedGame !== null) {                                                   //check if there is a saved game in storage
        userEmpire = new Empire(savedGame.empireName);
        if (typeof savedGame.food !== "undefined") userEmpire.food = savedGame.food;       //if so, set variables to values saved 
        if (typeof savedGame.wood !== "undefined") userEmpire.wood = savedGame.wood;
        if (typeof savedGame.stone !== "undefined") userEmpire.stone = savedGame.stone;
        if (typeof savedGame.gold !== "undefined") userEmpire.gold = savedGame.gold
        if (typeof savedGame.foodLevel !== "undefined") userEmpire.foodLevel = savedGame.foodLevel;
        if (typeof savedGame.woodLevel !== "undefined") userEmpire.woodLevel = savedGame.woodLevel;
        if (typeof savedGame.miningLevel !== "undefined") userEmpire.miningLevel = savedGame.miningLevel
        if (typeof savedGame.armyLevel !== "undefined") userEmpire.armyLevel = savedGame.armyLevel;
        if (typeof savedGame.maxFoodCapacity !== "undefined") userEmpire.maxFoodCapacity = savedGame.maxFoodCapacity;
        if (typeof savedGame.maxWoodCapacity !== "undefined") userEmpire.maxWoodCapacity = savedGame.maxWoodCapacity;
        if (typeof savedGame.maxStoneCapacity !== "undefined") userEmpire.maxStoneCapacity = savedGame.maxStoneCapacity;
        if (typeof savedGame.maxGoldCapacity !== "undefined") userEmpire.maxGoldCapacity = savedGame.maxGoldCapacity;
        if (typeof savedGame.userEmpireHuts !== "undefined") userEmpire.huts = savedGame.userEmpireHuts;
        if (typeof savedGame.workers !== "undefined") userEmpire.workers = savedGame.workers
        if (typeof savedGame.warriors !== "undefined") userEmpire.warriors = savedGame.warriors;
        if (typeof savedGame.hutCost !== "undefined") userEmpire.hutCost = savedGame.hutCost;
        if (typeof savedGame.empireName !== "undefined") userEmpire.name = savedGame.empireName;
        if (typeof savedGame.timeTick !== "undefined") timeTick = savedGame.timeTick;
        if (typeof savedGame.currentPopulation !== "undefined") userEmpire.currentPopulation = savedGame.currentPopulation;
        if (typeof savedGame.maxPopulation !== "undefined") userEmpire.maxPopulation = savedGame.maxPopulation;
        if (typeof savedGame.newFollowerCountdown !== "undefined") newFollowerCountdown = savedGame.newFollowerCountdown;

        updateDocumentElements();                                               //update document for user to see values
    }
    else {                                                                      //no save in storage
        empireName = prompt("Please enter a name for your empire:");            //name your empire --> needs check for character
        userEmpire = new Empire(empireName);
        userEmpire.currentPopulation = 0;                                                  //set variables at starting levels
        userEmpire.maxPopulation = 0;
        timeTick = 0;
        userEmpire.food = 0;
        userEmpire.wood = 10;
        userEmpire.stone = 0;
        userEmpire.gold = 0;
        userEmpire.foodLevel = 0;
        userEmpire.woodLevel = 0;
        userEmpire.miningLevel = 0;
        userEmpire.armyLevel = 0;
        userEmpire.maxFoodCapacity = 100;
        userEmpire.maxWoodCapacity = 100;
        userEmpire.maxStoneCapacity = 0;
        userEmpire.maxGoldCapacity = 0;
        userEmpire.huts = 0;
        userEmpire.workers = 0;
        userEmpire.warriors = 0;
        userEmpire.hutCost = 10;
        userEmpire.idleFollowers = 0;
        userEmpire.newFollowerCountdown = 0;
        hideOrShowIdleFollowers();                                              //determine to hide or show idle follower section
        updateDocumentElements();                                               //update document for user to see values
    }
    displayFoodUpgradeInfo();                                                   //show user food upgrade
    displayLumberUpgradeInfo();                                                 //show user lumber upgrade
    displayMiningUpgradeInfo();                                                 //show user mining upgrade
    displayArmyUpgradeInfo();                                                   //show user army upgrade
    empire1 = new Empire("Mordor");
    empire2 = new Empire("Revere");
    empire3 = new Empire("Babylon");
    activateUpgradeButtons();
}

function restartGame() {                                                        //start a new game
    localStorage.removeItem("savedEmpire");                                     //delete game saved in storage
    document.getElementById('gameText').innerHTML = "";                         //reset game text on document
    load();                                                                     //load up new game
}

$( document ).ready(function() {
    load();
});

function updateDocumentElements() {                                             //update document for user to see values
    $("#currentPopulation").text(userEmpire.currentPopulation);
    $("#maxPopulation").text(userEmpire.maxPopulation);
    $("#empireName").text(userEmpire.name);
    $("#foodCount").text(userEmpire.food);
    $("#woodCount").text(userEmpire.wood);
    $("#stoneCount").text(userEmpire.stone);
    $("#goldCount").text(userEmpire.gold);
    $("#hutCount").text(userEmpire.huts);
    $("#hutCost").text(userEmpire.hutCost);
    $("#warriorCount").text(userEmpire.warriors);
    $("#workerCount").text(userEmpire.workers);
    $("#foodLevel").text(userEmpire.foodLevel);
    $("#woodLevel").text(userEmpire.woodLevel);
    $("#armyLevel").text(userEmpire.armyLevel);
    $("#miningLevel").text(userEmpire.miningLevel);
}

//#endregion