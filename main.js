var cookies = 0;
var buildings = 0;

function cookieClick(number) {
    cookies += number;
    document.getElementById("cookieCount").innerHTML = cookies;
}

function buyBuilding(){
    var buildingCost = Math.floor(10 * Math.pow(1.1,buildings));       //works out the cost of this cursor
    if(cookies >= buildingCost){                                     //checks that the player can afford the cursor
        buildings++;                                              //increases number of cursors
    	cookies -= buildingCost;                                     //removes the cookies spent
        document.getElementById('buildingCount').innerHTML = buildings;  //updates the number of cursors for the user
        document.getElementById('cookieCount').innerHTML = cookies;      //updates the number of cookies for the user
    };
    var nextCost = Math.floor(10 * Math.pow(1.1,buildings));           //works out the cost of the next cursor
    document.getElementById('buildingCost').innerHTML = nextCost;      //updates the cursor cost for the user
}

window.setInterval(function(){
    cookieClick(buildings);
}, 1000);