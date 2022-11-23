var cookies = 0;

function cookieClick(number) {
    cookies = cookies + number;
    document.getElementById("cookieCount").innerHTML = cookies;
}