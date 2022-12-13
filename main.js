//#region Variables
window.empireName;
window.timeTick = 0;
var userEmpire;
var empire1;
var empire2;
var empire3;
var eatingTimer = 8;                                                                //everyone eats 3 times per day
var nightFireTimer = 24;                                                            //all living spaces need fire at night
var food = 0;
var foodCooldown = 5;
var foodTimer = 0;
var foodLevel = 0;
var foodEmoji = "&#129385;";
var maxFoodCapacity = 100;
window.wood = 0;
var woodCooldown = 5;
var woodTimer = 0;
var woodLevel = 0;
var woodEmoji = "&#129717;";
var maxWoodCapacity = 100;
var miningLevel = 0;
var stone = 0;
var stoneTimer = 0;
var stoneCooldown = 25;
var stoneEmoji = "&#129704;";
var maxStoneCapacity = 0;
var gold = 0;
var goldTimer = 0;
var goldCooldown = 35;
var goldEmoji = "";
var maxGoldCapacity = 0;
var huts = 0;
var armyLevel = 0;
var hutCost = 10;
var currentPopulation = 0;
var maxPopulation = 0;
var idleFollowers = 0;
var warriors = 0;
var workers = 0;
var newFollowerCountdown = 0;
var gameText = document.getElementById('gameText');
var foodUpgrades = [
    level1 = new Building("Small Silo", 100, 50, 0, 0, 250, 0, 0, 0, 0),
    level2 = new Building("Bunker", 200, 100, 10, 0, 400, 0, 0, 0, 0),
    level3 = new Building("Large Silo", 300, 125, 60, 0, 650, 0, 0, 0, 0) 
];
var lumberUpgrades = [
    level1 = new Building("Lumber Camp", 100, 200, 0, 0, 0, 250, 0, 0, 0),
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
}

function foodClick() {
    var foodAdded = (workers * (1 + (Math.floor(huts * .25) + foodLevel))) * 10;//calculate food added
    if (foodAdded == 0) foodAdded = workers + 1;                                //make sure to add something
    food += foodAdded;                                                          //add food to current stash
    if (food > maxFoodCapacity) food = maxFoodCapacity;                         //cannot exceed capacity
    $("#foodCount").text(food);                                                 //update amount of food to user
    $('#foodClickBtn').prop('disabled', true);                                  //disable button until cooldown
}

function woodClick() {
    var woodAdded = (workers * (1 + woodLevel)) * 7;                            //add 1 wood --> needs to calculation
    wood += woodAdded;                                                          //add wood to stash
    if (wood > maxWoodCapacity) wood = maxWoodCapacity;                         //cannot exceed capacity
    $('#woodClickBtn').prop('disabled', true);                                  //disable button until cooldown
    $('#woodCount').text(wood);                                                 //dupdate amount of wood to user
}

function stoneClick() {
    stone += Math.round(workers / 3);
    $('#stoneCount').text(stone);
    $('#stoneClickBtn').prop('disabled', true);                                 //disable button until cooldown
}

function goldClick() {
    gold += Math.round(workers / 5);
    $('#goldCount').text(gold);
    $('#goldClickBtn').prop('disabled', true);                                  //disable button until cooldown
}

//#endregion

//#region Resource Consumption
function calculateFoodConsumption() {
    food -= workers + (warriors * 3);                                           //remove food from stash
    $("#foodCount").text(food);                                                 //update amouhnt of food to user
}

function calculateFireWoodUsage() {
    var woodUsage = 0;
    woodUsage += huts * 3;
    woodUsage += armyLevel * 5;
    wood -= woodUsage;
    $("#woodCount").text(wood);
}

//#endregion

//#region Raise Buildings

function buyHut(){
    var hutCost;
    if (huts == 0) 
        hutCost = 10;                                                           //first hut cost 10 wood
    else 
        hutCost = Math.floor(25 * Math.pow(1.1,huts));                          //works out the cost of this hut
    if(wood >= hutCost){                                                        //checks that the player can afford the hut
        huts++;                                                                 //increases number of huts
        if (huts == 1) {                                                        //explain what huts do for your empire
            document.getElementById('gameText').innerHTML = "Huts will attract people to your empire and give them a place to call home.<br /><br />"
            + document.getElementById('gameText').innerHTML; 
        }
        maxPopulation += 3;                                                     //increase population limit
    	wood -= hutCost;                                                        //removes the food spent
        $('#hutCount').text(huts);                                              //updates the number of huts for the user
        $('#woodCount').text(wood);                                             //updates the number of wood for the user
        $('#maxPopulation').text(maxPopulation);                                //update maxPopulation for user
    };
    var nextCost = Math.floor(25 * Math.pow(1.1,huts));                         //works out the cost of the next hut
    $('#hutCost').text(nextCost);                                               //updates the hut cost for the user
}

function purchaseUpgrade(nextUpgrade) {                                         //removes resources after buying upgrade
    food -= nextUpgrade.foodCost;                                       
    wood -= nextUpgrade.woodCost;
    stone -= nextUpgrade.stoneCost;
    gold -= nextUpgrade.goldCost;
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
    var nextUpgrade = foodUpgrades[foodLevel];                                  //determine what the next upgrade is in array
    if (food >= nextUpgrade.foodCost && wood >= nextUpgrade.woodCost &&         //make sure user has all needed resources
        stone >= nextUpgrade.stoneCost && gold >= nextUpgrade.goldCost) {
        foodLevel++;                                                            //increase woodLevel after upgrade
        purchaseUpgrade(nextUpgrade);                                           //complete purchase
        $("#foodLevel").text(foodLevel);                                        //update wood level to user
        displayFoodUpgradeInfo();                                               //show user new upgrade available
        maxFoodCapacity = nextUpgrade.maxCapacity;                              //update max capacity for this resource

    }
}

function displayFoodUpgradeInfo() {                                             //show user new upgrade available
    if (foodLevel < foodUpgrades.length) {                                      //check for another upgrade available
        var nextUpgrade = foodUpgrades[foodLevel];                              //assign next upgrade from array
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
    var nextUpgrade = lumberUpgrades[woodLevel];                                //determine what the next upgrade is in array
    if (food >= nextUpgrade.foodCost && wood >= nextUpgrade.woodCost &&         //make sure user has all needed resources
        stone >= nextUpgrade.stoneCost && gold >= nextUpgrade.goldCost) {
        woodLevel++;                                                            //increase woodLevel after upgrade
        purchaseUpgrade(nextUpgrade);                                           //complete purchase
        $("#woodLevel").text(woodLevel);                                        //update wood level to user
        displayLumberUpgradeInfo();                                             //show user new upgrade available
        maxWoodCapacity = nextUpgrade.maxCapacity                               //update max capacity for this resource
    }
}

function displayLumberUpgradeInfo() {                                           //show user new upgrade available
    if (woodLevel < lumberUpgrades.length) {                                    //check for another upgrade available
        var nextUpgrade = lumberUpgrades[woodLevel];                            //assign next upgrade from array
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
    var nextUpgrade = miningUpgrades[miningLevel];                              //determine what the next upgrade is in array
    if (food >= nextUpgrade.foodCost && wood >= nextUpgrade.woodCost &&         //make sure user has all needed resources
        stone >= nextUpgrade.stoneCost && gold >= nextUpgrade.goldCost) {
        miningLevel++;                                                          //increase miningLevel after upgrade
        purchaseUpgrade(nextUpgrade);                                           //complete purchase
        $("#miningLevel").text(miningLevel);                                    //update mining level to user
        displayMiningUpgradeInfo();                                             //show user new upgrade available
        maxFoodCapacity = nextUpgrade.maxCapacity;                              //update max capacity for this resource
    }
    if (miningLevel > 0) {
        $('#stoneClickBtn').prop('disabled', false);
        $('#goldClickBtn').prop('disabled', false);
    }
    else if (miningLevel == 0) {
        $('#stoneClickBtn').prop('disabled', true);
        $('#goldClickBtn').prop('disabled', true);
    }
}

function displayMiningUpgradeInfo() {                                           //show user new upgrade available
    if (miningLevel < miningUpgrades.length) {                                  //check for another upgrade available
        var nextUpgrade = miningUpgrades[miningLevel];                          //assign next upgrade from array
        var costText = displayNextUpgradeCost(nextUpgrade);                     //determine cost of next upgrade
        $("#upgradeMiningBtn").text(nextUpgrade.name);                          //give button name of next upgrade as text
        $("#miningUpgradeCost").text(costText);                                 //display cost of next upgrade to user
        updateDocumentElements();                                               //update document for user
    }
    else {
        $("#upgradeMiningBtn").prop('disabled', true);                          //disable button if no upgrade available
        $("#miningUpgradeCost").text("No more mining upgrades.");               //tell user no available upgrades
    }
}

function upgradeArmy() {                                                        //army upgrade
    var nextUpgrade = armyUpgrades[armyLevel];                                  //determine what the next upgrade is in array
    if (food >= nextUpgrade.foodCost && wood >= nextUpgrade.woodCost && 
        stone >= nextUpgrade.stoneCost && gold >= nextUpgrade.goldCost) {       
        armyLevel++;                                                            //increase armyLevel after upgrade
        purchaseUpgrade(nextUpgrade);                                           //complete purchase
        $("#armyLevel").text(armyLevel);                                        //update army level to user
        displayArmyUpgradeInfo();                                               //show user new upgrade available
    }
}

function displayArmyUpgradeInfo() {                                             //show user new upgrade available
    if (armyLevel < armyUpgrades.length) {                                      //check for another upgrade available
        var nextUpgrade = armyUpgrades[armyLevel];                              //assign next upgrade from array
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
    currentPopulation++;                                                        //add new follower to population   
    idleFollowers++;                                                            //new follower is idle until trained
    $('#currentPopulation').text(currentPopulation);                            //show user new population status
    document.getElementById('gameText').innerHTML = "A new follower has found their way to "               //add game text to tell user new follower joined
    + empireName + "!<br /><br />" + document.getElementById('gameText').innerHTML;
    newFollowerCountdown = 0;                                                   //set countdown to 0 to reset process
}

function trainWarrior() {                                                       //idle follower trains to become warrior
    warriors++;                                                                 //add 1 to warrior count
    if (warriors == 1) {                                                        //explain what warriors do for your empire
        document.getElementById('gameText').innerHTML = "Warriors provide much more protection for " +
        "the empire while consuming more food than workers.<br /><br />"
        + document.getElementById('gameText').innerHTML; 
    }
    $("#warriorCount").text(warriors);                                          //update warrior count to user
    idleFollowers--;                                                            //remove an idle follower
    $("#newFollowerCount").text(idleFollowers);                                 //update new follower count to user
    hideOrShowIdleFollowers();                                                  //decide if idle follower row should be hidden
}

function trainWorker() {                                                        //idle follower trains to become worker
    workers++;                                                                  //add 1 to worker count
    $("#workerCount").text(workers);                                            //update worker count to user
    idleFollowers--;                                                            //remove an idle follower
    $("#newFollowerCount").text(idleFollowers);                                 //update new follower count to user
    hideOrShowIdleFollowers();                                                  //decide if idle follower row should be hidden
}

function hideOrShowIdleFollowers() {                                            //decide if idle follower row should be hidden
    if (idleFollowers > 0) {                                                    //if there are idle followers --> show row
        $("#newFollowerCount").text(idleFollowers);
        $(".newFollowersRow").show();
        if (armyLevel > 0) {                                                    //if army level > 0, allow training of warriors
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
    if (currentPopulation < maxPopulation && newFollowerCountdown == 0) {       //determine if empire has space for new follower
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
    if (timeTick == 15 && huts == 0) {                                          //aid player into getting started
        document.getElementById('gameText').innerHTML = "An emporer can't run the empire alone. Chop some wood and build a hut!<br /><br />" 
        + document.getElementById('gameText').innerHTML;
    }
    if (foodTimer > 0) $("#foodClickBtn").prop('disabled', true);               //disable food button if not cooled down
    else $("#foodClickBtn").prop('disabled', false);
    if (woodTimer > 0) $("#woodClickBtn").prop('disabled', true);               //disable wood button if not cooled down
    else $("#woodClickBtn").prop('disabled', false);
    if (stoneTimer > 0) $("#stoneClickBtn").prop('disabled', true);             //disable stone button if not cooled down
    else $("#stoneClickBtn").prop('disabled', false);
    if (goldTimer > 0) $("#goldClickBtn").prop('disabled', true);               //disable gold button if not cooled down
    else $("#goldClickBtn").prop('disabled', false);
}

//#endregion

//#region Save - Load - Restart

function save() {                                                               //save game into local storage
    var save = {                                                                //save all game info into object
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
        miningLevel: miningLevel,
        gold: gold,
        maxFoodCapacity: maxFoodCapacity,
        maxWoodCapacity: maxWoodCapacity,
        maxStoneCapacity: maxStoneCapacity,
        maxGoldCapacity: maxGoldCapacity,
        armyLevel: armyLevel,
        huts: huts,
        hutCost: hutCost,
        newFollowerCountdown: newFollowerCountdown
    }
    localStorage.setItem("savedEmpire",JSON.stringify(save));                   //change save game into JSON for local storage
}

function load() {                                                               //load game from local storage
    var savedGame = JSON.parse(localStorage.getItem("savedEmpire"));            //change JSON to object

    if (savedGame !== null) {                                                   //check if there is a saved game in storage
        if (typeof savedGame.food !== "undefined") food = savedGame.food;       //if so, set variables to values saved 
        if (typeof savedGame.wood !== "undefined") wood = savedGame.wood;
        if (typeof savedGame.stone !== "undefined") stone = savedGame.stone;
        if (typeof savedGame.gold !== "undefined") gold = savedGame.gold
        if (typeof savedGame.foodLevel !== "undefined") foodLevel = savedGame.foodLevel;
        if (typeof savedGame.woodLevel !== "undefined") woodLevel = savedGame.woodLevel;
        if (typeof savedGame.miningLevel !== "undefined") miningLevel = savedGame.miningLevel
        if (typeof savedGame.armyLevel !== "undefined") armyLevel = savedGame.armyLevel;
        if (typeof savedGame.maxFoodCapacity !== "undefined") maxFoodCapacity = savedGame.maxFoodCapacity;
        if (typeof savedGame.maxWoodCapacity !== "undefined") maxWoodCapacity = savedGame.maxWoodCapacity;
        if (typeof savedGame.maxStoneCapacity !== "undefined") maxStoneCapacity = savedGame.maxStoneCapacity;
        if (typeof savedGame.maxGoldCapacity !== "undefined") maxGoldCapacity = savedGame.maxGoldCapacity;
        if (typeof savedGame.huts !== "undefined") huts = savedGame.huts;
        if (typeof savedGame.workers !== "undefined") workers = savedGame.workers
        if (typeof savedGame.warriors !== "undefined") warriors = savedGame.warriors;
        if (typeof savedGame.hutCost !== "undefined") hutCost = savedGame.hutCost;
        if (typeof savedGame.empireName !== "undefined") empireName = savedGame.empireName;
        if (typeof savedGame.timeTick !== "undefined") timeTick = savedGame.timeTick;
        if (typeof savedGame.currentPopulation !== "undefined") currentPopulation = savedGame.currentPopulation;
        if (typeof savedGame.maxPopulation !== "undefined") maxPopulation = savedGame.maxPopulation;
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
    console.log(userEmpire);
    empire1 = new Empire("Mordor");
    empire1.displayData();
    empire2 = new Empire("Revere");
    empire2.displayData();
    empire3 = new Empire("Babylon");
    empire3.displayData();
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
    $("#currentPopulation").text(currentPopulation);
    $("#maxPopulation").text(maxPopulation);
    $("#empireName").text(empireName);
    $("#foodCount").text(food);
    $("#woodCount").text(wood);
    $("#stoneCount").text(stone);
    $("#goldCount").text(gold);
    $("#hutCount").text(huts);
    $("#hutCost").text(hutCost);
    $("#warriorCount").text(warriors);
    $("#workerCount").text(workers);
    $("#woodLevel").text(woodLevel);
    $("#armyLevel").text(armyLevel);
    $("#miningLevel").text(miningLevel);
}

//#endregion