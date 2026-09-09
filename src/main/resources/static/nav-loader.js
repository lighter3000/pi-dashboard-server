fetch("nav.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("navigation-placeholder").innerHTML = data;
    });