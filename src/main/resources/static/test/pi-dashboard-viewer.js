
const cpuLoadElement = document.getElementById("cpu-load");
const memoryUsageElement = document.getElementById("memory-usage");
const freeMemoryElement = document.getElementById("memory-free");
const availableMemoryElement = document.getElementById("memory-available");
const totalMemoryElement = document.getElementById("memory-total");
const diskUsageElement = document.getElementById("disk-usage");
const freeSpaceElement = document.getElementById("space-free");
const totalSpaceElement = document.getElementById("space-total");


updateDashboard();

setInterval(updateDashboard, 1000);

function updateDashboard() {
    fetch('/system/stats')
        .then(response => response.json())
        .then(data => {
            const cpuLoad = Math.trunc(data.cpuLoad*100);
            const memoryUsage = Math.trunc((data.totalMemory - data.freeMemory) / data.totalMemory * 100);
            const freeMemory = (data.freeMemory / 1024**3).toFixed(2);
            const availableMemory = (data.availableMemory / 1024**3).toFixed(2);
            const totalMemory = (data.totalMemory / 1024**3).toFixed(2);
            const diskUsage = Math.trunc((data.totalSpace - data.freeSpace) / data.totalSpace * 100);
            const freeSpace = (data.freeSpace / 1024**3).toFixed(2);
            const totalSpace = (data.totalSpace / 1024**3).toFixed(2);


            cpuLoadElement.textContent = `CPU Usage: ${cpuLoad}%`;
            memoryUsageElement.textContent = `Memory Usage: ${memoryUsage}%`;
            freeMemoryElement.textContent = `Free Memory: ${freeMemory} GB`;
            availableMemoryElement.textContent = `Available Memory: ${availableMemory} GB`;
            totalMemoryElement.textContent = `Total Memory: ${totalMemory} GB`;
            diskUsageElement.textContent = `Disk Usage: ${diskUsage}%`;
            freeSpaceElement.textContent = `Free Disk Space: ${freeSpace} GB`;
            totalSpaceElement.textContent = `Total Disk Space: ${totalSpace} GB`;

        });
}
