package com.mitocode.biblappbackend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClienteDto {

    private Integer id;

    @NotNull
    private String nombres;

    @NotNull
    private String apellidos;

    @NotNull
    private String cedula;

    private String email;

    @NotNull
    private String telefono;

    private Boolean estado ;

    private LocalDateTime fechaRegistro;

}
