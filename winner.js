const urlParams = new URLSearchParams(window.location.search);
const timeElement = document.getElementById("time");
const shareLink = document.getElementById("share-link");
const copyLink = document.getElementById("copy-link");

const time = atob(decodeURIComponent(urlParams.get('t')));
timeElement.innerText = time;

const encodedTime = encodeURIComponent(btoa(time));
shareLink.innerText = `shareGame.html?t=${encodedTime}`;
shareLink.href = `shareGame.html?t=${encodedTime}`;

copyLink.onclick = () => {
    copyToClipboard();
    copyLink.innerText = "Copied";
}

function copyToClipboard(){
    navigator.clipboard.writeText(`shareGame.html?t=${encodedTime}`);
}