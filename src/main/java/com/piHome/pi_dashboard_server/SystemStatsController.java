package com.piHome.pi_dashboard_server;
import java.io.IOException;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class SystemStatsController {

    private final SystemStatsService statsService;

    public SystemStatsController(SystemStatsService statsService){
        this.statsService = statsService;
    }


    @GetMapping("/system/stats")
    Map<String, Object> getStats() throws IOException{
        return statsService.getStats();

        
    }
}