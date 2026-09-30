package com.mitocode.biblappbackend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoriaDto {

    private Integer id;

    @NotNull
    @Size(min = 5, max = 100, message = "{nombre.size}")
    private String nombre;

    @NotNull
    @Size(min = 10, max = 500, message = "{descripcion.size}")
    private String descripcion;

    private Boolean estado;

    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaModificacion;
}
