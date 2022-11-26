var cookies = 0;
var buildings = 0;
var prestige = 1;
var buildingCost = 10;

function cookieClick(number) {
    cookies += number;
    document.getElementById("cookieCount").innerHTML = cookies;
}

function buyBuilding(){
    buildingCost = Math.floor(10 * Math.pow(1.1,buildings));             //works out the cost of this cursor
    if(cookies >= buildingCost){                                         //checks that the player can afford the cursor
        buildings++;                                                     //increases number of cursors
    	cookies -= buildingCost;                                         //removes the cookies spent
        document.getElementById('buildingCount').innerHTML = buildings;  //updates the number of cursors for the user
        document.getElementById('cookieCount').innerHTML = cookies;      //updates the number of cookies for the user
    };
    var nextCost = Math.floor(10 * Math.pow(1.1,buildings));             //works out the cost of the next cursor
    document.getElementById('buildingCost').innerHTML = nextCost;        //updates the cursor cost for the user
}

window.setInterval(function(){
    cookieClick(buildings);
}, 1000);

function save() {
    console.log("Saving game to local storage...");
    var save = {
        cookies: cookies,
        buildings: buildings,
        prestige: prestige,
        buildingCost: buildingCost
    }

    localStorage.setItem("savedEmpire",JSON.stringify(save));
    console.log("Save process complete! Cookies = " + cookies + ", buildings = " + buildings + ", prestige = " + prestige);
}

function load() {
    var savedGame = JSON.parse(localStorage.getItem("savedEmpire"));

    if (savedGame !== null) {
        if (typeof savedGame.cookies !== "undefined") cookies = savedGame.cookies;
        if (typeof savedGame.buildings !== "undefined") buildings = savedGame.buildings;
        if (typeof savedGame.prestige !== "undefined") prestige = savedGame.prestige;
        if (typeof savedGame.buildingCost !== "undefinted") buildingCost = savedGame.buildingCost;

        console.log("Load process complete! Cookies = " + cookies + ", buildings = " + buildings + ", prestige = " + prestige);

        document.getElementById("cookieCount").innerHTML = cookies;
        document.getElementById("buildingCount").innerHTML = buildings;
        document.getElementById("buildingCost").innerHTML = buildingCost;
    }
    else {
        cookies = 0;
        buildings = 0;
        buildingCost = 10;
        document.getElementById("cookieCount").innerHTML = cookies;
        document.getElementById("buildingCount").innerHTML = buildings;
        document.getElementById("buildingCost").innerHTML = buildingCost;
    }
}

function restartGame() {
    localStorage.removeItem("savedEmpire");
    console.log("Save deleted! Cookies = " + cookies + ", buildings = " + buildings + ", prestige = " + prestige);
    load();
}