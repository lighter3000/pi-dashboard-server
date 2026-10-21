let cpuLoadElement;
let memoryUsageElement;
let freeMemoryElement;
let availableMemoryElement;
let totalMemoryElement;
let diskUsageElement;
let freeSpaceElement;
let totalSpaceElement;
let cpuUptimeElement;
let currentTimeElement;

let updateInterval = null;

function initDashboard() {
    clearInterval(updateInterval);

    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};
    histories = {};
    pieCharts = null;

    cpuLoadElement = document.getElementById("cpu-load");
    memoryUsageElement = document.getElementById("memory-usage");
    freeMemoryElement = document.getElementById("memory-free");
    availableMemoryElement = document.getElementById("memory-available");
    totalMemoryElement = document.getElementById("memory-total");
    diskUsageElement = document.getElementById("disk-usage");
    freeSpaceElement = document.getElementById("space-free");
    totalSpaceElement = document.getElementById("space-total");
    cpuUptimeElement = document.getElementById("cpu-uptime");
    currentTimeElement = document.getElementById("current-time");

    updateDashboard();
    updateInterval = setInterval(updateDashboard, 1000);

}


let charts = {};
let histories = {};

let pieCharts = null;


function updateDashboard() {
    fetch('/system/stats')
        .then(response => response.json())
        .then(data => {
            const cpuLoad = Math.trunc(data.cpuLoad*100);   // Chart fertig
            
            const memoryUsage = Math.trunc((data.totalMemory - data.freeMemory) / data.totalMemory * 100); // chart fertig
            
            const freeMemory = (data.freeMemory / 1024**3).toFixed(2); // (2) muss noch
            const availableMemory = (data.availableMemory / 1024**3).toFixed(2); // (2) muss noch 
            const totalMemory = (data.totalMemory / 1024**3).toFixed(2); // (2) muss noch

            const diskUsage = Math.trunc((data.totalSpace - data.freeSpace) / data.totalSpace * 100); // (3) muss noch
            const freeSpace = (data.freeSpace / 1024**3).toFixed(2); // (3) muss noch
            const totalSpace = (data.totalSpace / 1024**3).toFixed(2); // (3) muss noch

            const cpuUptime = formatTime(data.cpuUptime);

            const currentDate = new Date();
            const currentTime = currentDate.getDate() + "." + (currentDate.getMonth()+1) + "." + currentDate.getFullYear() + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

            cpuLoadElement.textContent = `CPU Usage: ${cpuLoad}%`;
            memoryUsageElement.textContent = `Memory Usage: ${memoryUsage}%`;
            freeMemoryElement.textContent = `Free Memory: ${freeMemory} GB`;
            availableMemoryElement.textContent = `Available Memory: ${availableMemory} GB`;
            totalMemoryElement.textContent = `Total Memory: ${totalMemory} GB`;
            diskUsageElement.textContent = `Disk Usage: ${diskUsage}%`;
            freeSpaceElement.textContent = `Free Disk Space: ${freeSpace} GB`;
            totalSpaceElement.textContent = `Total Disk Space: ${totalSpace} GB`;
            cpuUptimeElement.textContent = `CPU Uptime: ${cpuUptime}`;
            currentTimeElement.textContent = currentTime;

            // Create chart for CPU and RAM usage history
            if (!charts["cpu-load"]) {
                initChart("cpu-load", "cpu-usage-chart", "rgba(75, 192, 192, 0.2)", "CPU Usage");
                histories["cpu-load"] = [];
            }

            updateChart("cpu-load", cpuLoad);

            if (!charts["memory-usage"]) {
                initChart("memory-usage", "memory-usage-chart", "rgba(153, 102, 255, 0.2)", "Memory Usage");
                histories["memory-usage"] = [];
            }

            updateChart("memory-usage", memoryUsage);


            // Create chart for Multi Memory Usage history
            if (!charts["multi-memory-usage"]) {
                initMultiMemoryChart("multi-memory-usage", "multi-memory-usage-chart", "rgba(188, 255, 64, 0.2)", "rgba(255, 99, 132, 0.2)", "Memory Usage", totalMemory);
                histories["multi-memory-free-usage"] = [];
                histories["multi-memory-available-usage"] = [];
            }

            updateMultiMemoryChart("multi-memory-usage", freeMemory, availableMemory);

            // Create pie chart for DiskUsage
            updatePieChart(data);


        });
}

function formatTime(seconds){
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60 );
    return days + " Days, " + hours + " Hours, + " + minutes + " Min. ";
}

function initChart(chartId, canvasElementId, color, label){
    charts[chartId] = new Chart(canvasElementId, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                backgroundColor: color,
                borderColor: color,
                data: [],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: "Usage(%)"
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: label,
                },
                legend: {
                    display: false
                }
            }

        }
    });
}

function updateChart(chartId, newData) {
    // Update histories for CPU and RAM usage
    if(histories[chartId].length > 10) {
        histories[chartId].shift();
    }
    histories[chartId].push(newData);

    
    charts[chartId].data.labels = histories[chartId].map((_, index) => index+1);
    charts[chartId].data.datasets[0].data = histories[chartId];
    charts[chartId].update();



}

function initMultiMemoryChart(chartId, canvasElementId, colorOne, colorTwo, label, totalMemory){
    charts[chartId] = new Chart(canvasElementId, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                backgroundColor: colorOne,
                borderColor: colorOne,
                data: [],
            },
            {
                backgroundColor: colorTwo,
                borderColor: colorTwo,
                data: [],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: Math.ceil(totalMemory),
                    title: {
                        display: true,
                        text: "Usage(GB)"
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: label,
                },
                legend: {
                    display: true
                }
            }

        }
    });
}

function updateMultiMemoryChart(chartId, newDataOne, newDataTwo) {

    if(histories["multi-memory-free-usage"].length > 10) {
        histories["multi-memory-free-usage"].shift();
    }
    histories["multi-memory-free-usage"].push(newDataOne);

    if(histories["multi-memory-available-usage"].length > 10) {
        histories["multi-memory-available-usage"].shift();
    }
    histories["multi-memory-available-usage"].push(newDataTwo);

    charts[chartId].data.labels = histories["multi-memory-free-usage"].map((_, index) => index+1);
    charts[chartId].data.datasets[0].label = "Free Memory";
    charts[chartId].data.datasets[1].label = "Available Memory";
    charts[chartId].data.datasets[0].data = histories["multi-memory-free-usage"];
    charts[chartId].data.datasets[1].data = histories["multi-memory-available-usage"];
    charts[chartId].update();
}

function storagePieChart(data){
    pieCharts = {
        type: 'pie',
        data: {
            labels: ["Free Space", "UsedSpace"],
            datasets: [{
                data: [data.freeSpace, (data.totalSpace - data.freeSpace)],
                backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(75, 192, 192, 0.2)"],
                borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    }
}

function updatePieChart(data){
    if(pieCharts === null){
        storagePieChart(data);
        pieCharts.chartInstance = new Chart(document.getElementById("storage-pie-chart"), pieCharts)
        new Chart(document.getElementById("storage-pie-chart"), pieCharts);
    } else {
        pieCharts.data.datasets[0].data = [data.freeSpace, (data.totalSpace - data.freeSpace)];
        new Chart(document.getElementById("storage-pie-chart"), pieCharts);
    }
}