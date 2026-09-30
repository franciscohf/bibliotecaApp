package com.mitocode.biblappbackend.config;

import com.mitocode.biblappbackend.dto.ClienteDto;
import com.mitocode.biblappbackend.model.Cliente;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper defaultMapper() {
        return new ModelMapper();
    }



}
