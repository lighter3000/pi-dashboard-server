package com.piHome.pi_dashboard_server;

import java.io.File;
import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.HashMap;

import org.springframework.stereotype.Service;

import com.sun.management.OperatingSystemMXBean;

@Service
public class SystemStatsService {

    private final OperatingSystemMXBean osBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();

    public double getCpuLoad(){
        return osBean.getCpuLoad();
    }

    public Map<String, Long> getMemoryStats() throws IOException{
        return Map.of(
            "freeMemory", osBean.getFreeMemorySize(),
            "totalMemory", osBean.getTotalMemorySize(),
            "availableMemory", Files.readAllLines(Path.of("/proc/meminfo")).stream()
                .filter(line -> line.startsWith("MemAvailable:"))
                .map(line -> line.split("\\s+")[1])
                .mapToLong(Long::parseLong)
                .findFirst()
                .orElse(0L) * 1024 // Convert from kB to bytes
        );
    }

    public Map<String, Long> getDiskStats() {
        return Map.of(
            "totalSpace", File.listRoots()[0].getTotalSpace(),
            "freeSpace", File.listRoots()[0].getFreeSpace(),
            "usableSpace", File.listRoots()[0].getUsableSpace()
        );
    }

    public double getUptime() throws IOException{
        String content = Files.readString(Path.of("/proc/uptime"));
        return Double.parseDouble(content.split(" ")[0]);
    }



    public Map<String, Object> getStats() throws IOException{
        Map<String, Object> stats = new HashMap<>();
        stats.put("cpuLoad", getCpuLoad());
        stats.putAll(getMemoryStats());
        stats.putAll(getDiskStats());
        stats.put("cpuUptime", getUptime());
        return stats;
    }
}