package com.mitocode.biblappbackend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Min;
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
public class LibroDto {

    private Integer id;

    @NotNull
    @Size(min = 1, max = 200)
    private String titulo;

    @NotNull
    @Size(min = 1, max = 150)
    private String autor;

    @NotNull
    @Size(min = 1, max = 20)
    private String isbn;

    private Boolean disponible = true;

    @Size(max = 150)
    private String editorial;

    private Integer anioPublicacion;

    @NotNull
    @Min(0)
    private Integer cantidadEjemplares = 1;

    @Size(max = 250)
    private String photoUrl;

    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaModificacion;

    @NotNull
    private CategoriaDto categoria;

    public Integer getIdLibro() {
        return this.id;
    }

    public void setIdLibro(Integer idLibro) {
        this.id = idLibro;
    }
}
