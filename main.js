//#region Variables

window.timeTick = 0;
var userEmpire;
var empire1;
var empire2;
var empire3;
//everyone eats 3 times per day
var eatingTimer = 8;
//all living spaces need fire at night
var nightFireTimer = 24;
var foodCooldown = 5;
var foodTimer = 0;
var foodEmoji = "&#129385;";
var woodCooldown = 5;
var woodTimer = 0;
var woodEmoji = "&#129717;";
var stoneTimer = 0;
var stoneCooldown = 5;
var stoneEmoji = "&#129704;";
var goldTimer = 0;
var goldCooldown = 5;
var goldEmoji = "";
var randomEncounterTimer = -1;
var newDiscoveryEncounter = new RandomEncounter("Discovery");
var newFollowerCountdown = 0;
var gameText = document.getElementById('gameText');
var defaultWorker = new Person("Worker");
var defaultWarrior = new Person("Warrior");
var nextWorker = new Person("Worker");
var nextWarrior = new Person("Warrior");
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

//clicked on resource button
function manualClick(resource) {
    //food click
    if (resource == "food") {
        //set cooldown for food button
        foodTimer = foodCooldown;
        //run food click
        foodClick();
    }
    //wood click
    else if (resource == "wood") {
        //set cooldown for wood button
        woodTimer = woodCooldown;
        //run wood click
        woodClick();
    }
    //stone click
    else if (resource == "stone") {
        //set cooldown for stone button 
        stoneTimer = stoneCooldown;
        //run stone click
        stoneClick();
    }
    //gold click
    else if (resource == "gold") {
        //set cooldown for gold button
        goldTimer = goldCooldown;
        //run gold click
        goldClick();
    }
    activateUpgradeButtons();
}

function foodClick() {
    //calculate food added
    var foodAdded = (userEmpire.workers * (1 + (Math.floor(userEmpire.huts * .25) + userEmpire.foodLevel))) * 10;
    if (foodAdded == 0) {
        //make sure to add something
        foodAdded = userEmpire.workers + 1;
        foodTimer = 1;
    } 
    //add food to current stash
    userEmpire.food += foodAdded;
    //cannot exceed capacity
    if (userEmpire.food > userEmpire.maxFoodCapacity) userEmpire.food = userEmpire.maxFoodCapacity;
    //update amount of food to user
    $("#foodCount").text(userEmpire.food);
    //disable button until cooldown
    $('#foodClickBtn').prop('disabled', true);
}

function woodClick() {
    //add 1 wood --> needs to calculation
    var woodAdded = (userEmpire.workers * (1 + userEmpire.woodLevel)) * 7;
    if (woodAdded == 0) {
        woodAdded = 1;
        woodTimer = 1;
    }
    //add wood to stash
    userEmpire.wood += woodAdded;
    //cannot exceed capacity
    if (userEmpire.wood > userEmpire.maxWoodCapacity) userEmpire.wood = userEmpire.maxWoodCapacity;
    //disable button until cooldown
    $('#woodClickBtn').prop('disabled', true);
    //dupdate amount of wood to user
    $('#woodCount').text(userEmpire.wood);
    canAffordNextHut();
}

function stoneClick() {
    userEmpire.stone += 100;
    //cannot exceed capacity
    if (userEmpire.stone > userEmpire.maxStoneCapacity) userEmpire.stone = userEmpire.maxStoneCapacity;
    //userEmpire.stone += Math.round(userEmpire.workers / 3);
    $('#stoneCount').text(userEmpire.stone);
    //disable button until cooldown
    $('#stoneClickBtn').prop('disabled', true);
}

function goldClick() {
    userEmpire.gold += 100;
    //userEmpire.gold += Math.round(userEmpire.workers / 5);
    //cannot exceed capacity
    if (userEmpire.gold > userEmpire.maxGoldCapacity) userEmpire.gold = userEmpire.maxGoldCapacity;
    $('#goldCount').text(userEmpire.gold);
    //disable button until cooldown
    $('#goldClickBtn').prop('disabled', true);
}

//#endregion

//#region Resource Consumption
function calculateFoodConsumption() {
    //remove food from stash
    userEmpire.food -= userEmpire.workers + (userEmpire.warriors * 3);
    //update amount of food to user
    $("#foodCount").text(userEmpire.food);
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

function checkForMaxResources() {
    if (userEmpire.food >= userEmpire.maxFoodCapacity)
        $('#foodClickBtn').prop('disabled',true);
    if (userEmpire.wood >= userEmpire.maxWoodCapacity)
        $('#woodClickBtn').prop('disabled',true);
    if (userEmpire.stone >= userEmpire.maxStoneCapacity)
        $('#stoneClickBtn').prop('disabled',true);
    if (userEmpire.gold >= userEmpire.maxGoldCapacity)
        $('#goldClickBtn').prop('disabled',true);
    
}

//#endregion

//#region Raise Buildings

function buyHut(){
    
    if (userEmpire.huts == 0) {
        //first hut cost 10 wood
        userEmpire.hutCost = 10;
    }
    else {
        //works out the cost of this hut
        userEmpire.hutCost = Math.floor(25 * Math.pow(1.1,userEmpire.huts));
    }
    //checks that the player can afford the hut
    if(userEmpire.wood >= userEmpire.hutCost){
        //increases number of userEmpire.huts
        userEmpire.huts++;
        //explain what userEmpire.huts do for your empire
        if (userEmpire.huts == 1) {
            document.getElementById('gameText').innerHTML = "Huts will attract people to your empire and give them a place to call home.<br /><br />"
            + document.getElementById('gameText').innerHTML; 
        }
        //increase population limit
        userEmpire.maxPopulation += 3;
        //removes the food spent
    	userEmpire.wood -= userEmpire.hutCost;
        //updates the number of userEmpire.huts for the user
        $('#hutCount').text(userEmpire.huts);
        //updates the number of wood for the user
        $('#woodCount').text(userEmpire.wood);
        //update maxPopulation for user
        $('#maxPopulation').text(userEmpire.maxPopulation);
    };
    //works out the cost of the next hut
    var nextCost = Math.floor(25 * Math.pow(1.1,userEmpire.huts));
    //updates the hut cost for the user
    $('#hutCost').text(nextCost);
    userEmpire.hutCost = nextCost;
    canAffordNextHut();
    activateUpgradeButtons();
}

//removes resources after buying upgrade
function purchaseUpgrade(nextUpgrade) {
    userEmpire.food -= nextUpgrade.foodCost;                                       
    userEmpire.wood -= nextUpgrade.woodCost;
    userEmpire.stone -= nextUpgrade.stoneCost;
    userEmpire.gold -= nextUpgrade.goldCost;
    $('#foodCount').text(userEmpire.food); 
    $('#woodCount').text(userEmpire.wood); 
    $('#stoneCount').text(userEmpire.stone); 
    $('#golddCount').text(userEmpire.gold);
    activateUpgradeButtons();
}

//shows user cost for upgrades
function displayNextUpgradeCost(nextUpgrade) {
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

function displayResourceMaximums() {
    $('#maxFood').text(userEmpire.maxFoodCapacity);
    $('#maxWood').text(userEmpire.maxWoodCapacity);
    $('#maxStone').text(userEmpire.maxStoneCapacity);
    $('#maxGold').text(userEmpire.maxGoldCapacity);
}

//lumber upgrade
function upgradeFood() {
    //determine what the next upgrade is in array
    var nextUpgrade = foodUpgrades[userEmpire.foodLevel];
    //make sure user has all needed resources
    if (userEmpire.food >= nextUpgrade.foodCost && userEmpire.wood >= nextUpgrade.woodCost &&
    userEmpire.stone >= nextUpgrade.stoneCost && userEmpire.gold >= nextUpgrade.goldCost) {
        //increase woodLevel after upgrade
        userEmpire.foodLevel++;
        //update max capacity for this resource
        userEmpire.maxFoodCapacity = nextUpgrade.maxFoodCapacity;
        //complete purchase
        purchaseUpgrade(nextUpgrade);
        //update wood level to user
        $("#foodLevel").text(userEmpire.foodLevel);
        //show user new upgrade available
        displayFoodUpgradeInfo();
        displayResourceMaximums();
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
    canAffordNextWarrior();
    canAffordNextWorker();
}

function canAffordNextWorker() {
    if (userEmpire.food < nextWorker.foodCost || userEmpire.wood < nextWorker.woodCost) {
        $('#trainWorkerBtn').prop('disabled', true);
    }
    else $('#trainWorkerBtn').prop('disabled', false);
}

function canAffordNextWarrior() {
    if (userEmpire.food < nextWarrior.foodCost || userEmpire.stone < nextWorker.stoneCost || 
        userEmpire.gold < nextWarrior.goldCost) {
        $('#trainWarriorBtn').prop('disabled', true);
    }
    else $('#trainWarriorBtn').prop('disabled', false);
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
//show user new upgrade available
function displayFoodUpgradeInfo() {
    //check for another upgrade available
    if (userEmpire.foodLevel < foodUpgrades.length) {
        //assign next upgrade from array
        var nextUpgrade = foodUpgrades[userEmpire.foodLevel];
        //determine cost of next upgrade
        var costText = displayNextUpgradeCost(nextUpgrade);
        //give button name of next upgrade as text
        $("#upgradeFoodBtn").text(nextUpgrade.name);
        //display cost of next upgrade to user
        $("#foodUpgradeCost").text(costText);
        //update document for user
        updateDocumentElements();
    }
    else {
        //disable button if no upgrade available
        $("#upgradeFoodBtn").prop('disabled', true);
        //tell user no available upgrades
        $("#foodUpgradeCost").text("No more food upgrades.");
    }
}

//lumber upgrade
function upgradeWood() {
    //determine what the next upgrade is in array
    var nextUpgrade = lumberUpgrades[userEmpire.woodLevel];
    //make sure user has all needed resources
    if (userEmpire.food >= nextUpgrade.foodCost && userEmpire.wood >= nextUpgrade.woodCost &&
    userEmpire.stone >= nextUpgrade.stoneCost && userEmpire.gold >= nextUpgrade.goldCost) {
        //increase woodLevel after upgrade
        userEmpire.woodLevel++;
        //complete purchase
        purchaseUpgrade(nextUpgrade);
        //update wood level to user
        $("#woodLevel").text(userEmpire.woodLevel);
        //show user new upgrade available
        displayLumberUpgradeInfo();
        //update max capacity for this resource
        userEmpire.maxWoodCapacity = nextUpgrade.maxWoodCapacity;
        displayResourceMaximums();
    }
}

//show user new upgrade available
function displayLumberUpgradeInfo() {
    //check for another upgrade available
    if (userEmpire.woodLevel < lumberUpgrades.length) {
        //assign next upgrade from array
        var nextUpgrade = lumberUpgrades[userEmpire.woodLevel];
        //determine cost of next upgrade
        var costText = displayNextUpgradeCost(nextUpgrade);
        //give button name of next upgrade as text
        $("#upgradeWoodBtn").text(nextUpgrade.name);
        //display cost of next upgrade to user
        $("#woodUpgradeCost").text(costText);
        //update document for user
        updateDocumentElements();
    }
    else {
        //disable button if no upgrade available
        $("#upgradeWoodBtn").prop('disabled', true);
        //tell user no available upgrades
        $("#woodUpgradeCost").text("No more lumber upgrades.");
    }
}

//mining upgrade
function upgradeMining() {
    //determine what the next upgrade is in array
    var nextUpgrade = miningUpgrades[userEmpire.miningLevel];
    //make sure user has all needed resources
    if (userEmpire.food >= nextUpgrade.foodCost && userEmpire.wood >= nextUpgrade.woodCost &&
    userEmpire.stone >= nextUpgrade.stoneCost && userEmpire.gold >= nextUpgrade.goldCost) {
        //increase miningLevel after upgrade
        userEmpire.miningLevel++;
        //complete purchase
        purchaseUpgrade(nextUpgrade);
        //update mining level to user
        $("#miningLevel").text(userEmpire.miningLevel);
        //show user new upgrade available
        displayMiningUpgradeInfo();
        //update max capacity for this resource
        userEmpire.maxStoneCapacity = nextUpgrade.maxStoneCapacity;
        userEmpire.maxGoldCapacity = nextUpgrade.maxGoldCapacity;
        displayResourceMaximums();
    }
}

//show user new upgrade available
function displayMiningUpgradeInfo() {
    //check for another upgrade available
    if (userEmpire.miningLevel < miningUpgrades.length) {
        //assign next upgrade from array
        var nextUpgrade = miningUpgrades[userEmpire.miningLevel];
        //determine cost of next upgrade
        var costText = displayNextUpgradeCost(nextUpgrade);
        //give button name of next upgrade as text
        $("#upgradeMiningBtn").text(nextUpgrade.name);
        //display cost of next upgrade to user
        $("#miningUpgradeCost").text(costText);
        //update document for user
        updateDocumentElements();
    }
    else {
        //disable button if no upgrade available
        $("#upgradeMiningBtn").prop('disabled', true);
        //tell user no available upgrades
        $("#miningUpgradeCost").text("No more mining upgrades.");
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

//army upgrade
function upgradeArmy() {
    //determine what the next upgrade is in array
    var nextUpgrade = armyUpgrades[userEmpire.armyLevel];
    if (userEmpire.food >= nextUpgrade.foodCost && userEmpire.wood >= nextUpgrade.woodCost && 
        userEmpire.stone >= nextUpgrade.stoneCost && userEmpire.gold >= nextUpgrade.goldCost) {
            //increase armyLevel after upgrade
            userEmpire.armyLevel++;
            //complete purchase
        purchaseUpgrade(nextUpgrade);
        //update army level to user
        $("#armyLevel").text(userEmpire.armyLevel);
        //show user new upgrade available
        displayArmyUpgradeInfo();
    }
}

//show user new upgrade available
function displayArmyUpgradeInfo() {
    //check for another upgrade available
    if (userEmpire.armyLevel < armyUpgrades.length) {
        //assign next upgrade from array
        var nextUpgrade = armyUpgrades[userEmpire.armyLevel];
        //determine cost of next upgrade]
        var costText = displayNextUpgradeCost(nextUpgrade);
        //give button name of next upgrade as text
        $("#upgradeArmyBtn").text(nextUpgrade.name);
        //display cost of next upgrade to user
        $("#armyUpgradeCost").text(costText);
        //update docoument for user
        updateDocumentElements();
    }
    else {
        //disable button if no upgrade available
        $("#upgradeArmyBtn").prop('disabled', true);
        //tell user no available upgrades
        $("#armyUpgradeCost").text("No more army upgrades.");
    }
}

//#endregion

//#region New Follower --> Warrior or Worker

//create timer for new follower to join
function newFollowerTimer() {
    //random number between 1 and 10
    var random = Math.floor(Math.random() * 10);
    //set time for new follower
    newFollowerCountdown = timeTick + random;
}

//create new follower
function newFollower() {
    //add new follower to population
    userEmpire.currentPopulation++;
    //new follower is idle until trained
    userEmpire.idleFollowers++;
    console.log("idleFollowers = " + userEmpire.idleFollowers);
    $('#newFollowerCount').text(userEmpire.idleFollowers);
    //show user new population status
    $('#currentPopulation').text(userEmpire.currentPopulation);
    //add game text to tell user new follower joined
    document.getElementById('gameText').innerHTML = "A new follower has found their way to "
    + userEmpire.name + "!<br /><br />" + document.getElementById('gameText').innerHTML;
    //set countdown to 0 to reset process
    newFollowerCountdown = 0;
}

//idle follower trains to become warrior
function trainWarrior() {
    //add 1 to warrior count
    userEmpire.warriors++;
    //explain what warriors do for your empire
    if (userEmpire.warriors == 1) {
        document.getElementById('gameText').innerHTML = "Warriors provide much more protection for " +
        "the empire while consuming more food than workers.<br /><br />"
        + document.getElementById('gameText').innerHTML; 
    }
    //update warrior count to user
    $("#warriorCount").text(userEmpire.warriors);
    //remove an idle follower
    userEmpire.idleFollowers--;
    console.log("idleFollowers = " + userEmpire.idleFollowers);
    //update new follower count to user
    $('#newFollowerCount').text(userEmpire.idleFollowers);
    payForTrainingNewFollower(nextWarrior);
    //decide if idle follower row should be hidden
    hideOrShowIdleFollowers();
    nextWarrior.foodCost = Math.floor(defaultWarrior.foodCost * Math.pow(1.15, userEmpire.warriors));
    //nextWarrior.woodCost = Math.floor(defaultWarrior.woodCost * Math.pow(1.1, userEmpire.warriors));
    nextWarrior.stoneCost = Math.floor(defaultWarrior.stoneCost * Math.pow(1.1, userEmpire.warriors));
    nextWarrior.goldCost = Math.floor(defaultWarrior.goldCost * Math.pow(1.1, userEmpire.warriors));
    $('#nextWarriorCost').text(nextWarrior.foodCost + " food | "
        + nextWarrior.stoneCost + " stone | " + nextWarrior.goldCost + " gold");
}

//idle follower trains to become worker
function trainWorker() {
    //add 1 to worker count
    userEmpire.workers++;
    //being randomEncounter timer now that there are workers
    if (userEmpire.workers == 1) {
        randomEncounterTimer = 10;
    }
    //update worker count to user
    $("#workerCount").text(userEmpire.workers);
    //remove an idle follower
    userEmpire.idleFollowers--;
    console.log("idleFollowers = " + userEmpire.idleFollowers);
    //update new follower count to user
    $("#newFollowerCount").text(userEmpire.idleFollowers);
    payForTrainingNewFollower(nextWorker);
    //decide if idle follower row should be hidden
    nextWorker.foodCost = Math.floor(defaultWorker.foodCost * Math.pow(1.15, userEmpire.workers));
    nextWorker.woodCost = Math.floor(defaultWorker.woodCost * Math.pow(1.1, userEmpire.workers));
    nextWorker.stoneCost = Math.floor(defaultWorker.stoneCost * Math.pow(1.1, userEmpire.workers));
    nextWorker.goldCost = Math.floor(defaultWorker.goldCost * Math.pow(1.1, userEmpire.workers));
    $('#nextWorkerCost').text(nextWorker.foodCost + " food | " + nextWorker.woodCost + " wood");
    hideOrShowIdleFollowers();
}

function payForTrainingNewFollower(newPerson) {
    userEmpire.food -= newPerson.foodCost;
    userEmpire.wood -= newPerson.woodCost;
    userEmpire.stone -= newPerson.stoneCost;
    userEmpire.gold -= newPerson.goldCost;
    updateDocumentElements();
}

//decide if idle follower row should be hidden
function hideOrShowIdleFollowers() {
    //if there are idle followers --> show row
    if (userEmpire.idleFollowers > 0) {
        //$('#newFollowerCount').text(userEmpire.idleFollowers);
        $(".newFollowersRow").show();
        //cant' train warriors unless you have 1st army upgrade
        if (userEmpire.armyLevel > 0) {
            $("#followerBecomesWarrior").show();
        }
        //if army level = 0, can't train warriors
        else {
            $("#followerBecomesWarrior").hide();
        }
        $('#nextWorkerCost').text(nextWorker.foodCost + " food | " + nextWorker.woodCost + " wood");
        $('#nextWarriorCost').text(nextWarrior.foodCost + " food | "
        + nextWarrior.stoneCost + " stone | " + nextWarrior.goldCost + " gold");
    }
    else {
        //no idle followers --> hide row
        $(".newFollowersRow").hide();
    }
}

//#endregion

function addResourcesFromDiscovery(discoveryEncounter) {
    userEmpire.food += discoveryEncounter.foodDiscovery;
    userEmpire.wood += discoveryEncounter.woodDiscovery;
    userEmpire.stone += discoveryEncounter.stoneDiscovery;
    userEmpire.gold += discoveryEncounter.goldDiscovery;
    document.getElementById('gameText').innerHTML = discoveryEncounter.flavorText + "<br /><br />" 
        + document.getElementById('gameText').innerHTML;
    updateDocumentElements();

}

//#region Game Engine

//timer that acts as the game engine
window.setInterval(function(){
    //timer clicks every second
    advanceTime();
    //determine if empire has space for new follower
    if (userEmpire.currentPopulation < userEmpire.maxPopulation && newFollowerCountdown == 0) {
        //set timer for new follower to join
        newFollowerTimer();
    }
    //check if it is time to add new follower
    if (timeTick == newFollowerCountdown) {
        //run new follower function
        newFollower();
    }
    //decide to hide or show new follower section
    hideOrShowIdleFollowers();
    eatingTimer--;
    if (eatingTimer == 0) {
        //determine how much food is consumed
        calculateFoodConsumption();
        eatingTimer = 8;
    }
    nightFireTimer--;
    if (nightFireTimer == 0) {
        calculateFireWoodUsage();
        nightFireTimer = 24;
    }
    checkForMaxResources();
}, 1000); //1000 = 1 second


function advanceTime() {
    //advance time in universe
    timeTick++;
    //decrement all resource timers
    foodTimer--;
    woodTimer--;
    stoneTimer--;
    goldTimer--;
    randomEncounterTimer--;
    console.log(randomEncounterTimer);
    //Intro flavor text
    if (timeTick == 4) {
        document.getElementById('gameText').innerHTML = "A new empire will be forged by their strong and " 
        + "fearless leader!<br /><br />" 
        + document.getElementById('gameText').innerHTML;
    }
    //Intro flavor text 2
    if (timeTick == 8) {
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
    //aid player into getting started
    if (timeTick == 15 && userEmpire.huts == 0) {
        document.getElementById('gameText').innerHTML = "An emperor can't run the empire alone. Chop some wood and build a hut!<br /><br />" 
        + document.getElementById('gameText').innerHTML;
    }
    //disable food button if not cooled down
    if (foodTimer > 0) $("#foodClickBtn").prop('disabled', true);
    else $("#foodClickBtn").prop('disabled', false);
    //disable wood button if not cooled down
    if (woodTimer > 0) $("#woodClickBtn").prop('disabled', true);
    else $("#woodClickBtn").prop('disabled', false);
    //disable stone button if not cooled down or don't have 1st mining upgrade
    if (stoneTimer > 0 || userEmpire.miningLevel == 0) $("#stoneClickBtn").prop('disabled', true);
    else $("#stoneClickBtn").prop('disabled', false);
    //disable gold button if not cooled down or don't have 1st mining upgrade
    if (goldTimer > 0 || userEmpire.miningLevel == 0) $("#goldClickBtn").prop('disabled', true);
    else $("#goldClickBtn").prop('disabled', false);
    //create a randomEncounter when timer reaches 0
    if (randomEncounterTimer == 0) {
        newDiscoveryEncounter.discoveryEncounter();
        addResourcesFromDiscovery(newDiscoveryEncounter);
        randomEncounterTimer = 10;
    }
}

//#endregion

function displayOtherEmpiresInfo() {
    $('#empire1Name').text(empire1.name);
    $('#empire2Name').text(empire2.name);
    $('#empire3Name').text(empire3.name);
}

//#region Save - Load - Restart

//save game into local storage
function save() {
    //save all game info into object
    var save = {
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
        //need to save all other empires in the universe and their information
        //could an empire object be saved into file?         <==================================
    }
    //change save game into JSON for local storage
    localStorage.setItem("savedEmpire",JSON.stringify(save));
}

//load game from local storage
function load() {
    
    //change JSON to object
    var savedGame = JSON.parse(localStorage.getItem("savedEmpire"));

    //check if there is a saved game in storage
    if (savedGame !== null) {
        userEmpire = new Empire(savedGame.empireName);
        //if so, set variables to values saved
        if (typeof savedGame.food !== "undefined") userEmpire.food = savedGame.food;
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

        //update document for user to see values
        updateDocumentElements();
    }
    //no save in storage
    else {
        //name your empire --> needs check for character
        empireName = prompt("Please enter a name for your empire:");
        userEmpire = new Empire(empireName);
        //set variables at starting levels
        //does everything below need to be set if userEmpire is created as new Empire? <=================
        userEmpire.currentPopulation = 0;
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
        //determine to hide or show idle follower section
        hideOrShowIdleFollowers();
        //update document for user to see values
        updateDocumentElements();
    }
    //show user all available upgrades
    displayFoodUpgradeInfo();
    displayLumberUpgradeInfo();
    displayMiningUpgradeInfo();
    displayArmyUpgradeInfo();
    empire1 = new Empire("Mordor");
    empire2 = new Empire("Revere");
    empire3 = new Empire("Babylon");
    activateUpgradeButtons();
    displayResourceMaximums();
    displayOtherEmpiresInfo();
}

//start a new game
function restartGame() {
    //delete game saved in storage
    localStorage.removeItem("savedEmpire");
    //reset game text on document
    document.getElementById('gameText').innerHTML = "";
    //load up new game
    load();
}

$( document ).ready(function() {
    load();
});

//update document for user to see values
function updateDocumentElements() {
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
    canAffordNextWarrior();
    canAffordNextWorker();
}

//#endregion