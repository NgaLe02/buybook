package com.a2m.back.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Author tiennd
 * Created date 2023-07-15
 */

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

//    @Bean
//    public LogoutServiceImpl logoutService() {
//        return new LogoutServiceImpl();
//    }

//    @Value("${slo.datasource.url}")
//    private String url;
//
//    @Value("${slo.datasource.username}")
//    private String username;
//
//    @Value("${slo.datasource.password}")
//    private String password;

//    @Bean
//    public void initSloDb() {
//        MariadbConnection.getInstance().init(url, username, password);
//    }
}
