const timeElement = document.getElementById("current-time");

function updateTime() {
    const currentDate = new Date();
    const currentTime = currentDate.getDate() + "." + (currentDate.getMonth()+1) + "." + currentDate.getFullYear() + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
    timeElement.textContent = `${currentTime}`;
}

setInterval(updateTime, 10);