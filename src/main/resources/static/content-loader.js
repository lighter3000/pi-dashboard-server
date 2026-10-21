fetch("home.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("content-placeholder").innerHTML = data;
        initDashboard();
    });


function callContent(url){
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById("content-placeholder").innerHTML = data;
            if(url === "pi-dashboard.html"){
                initDashboard();
            }
        });
}