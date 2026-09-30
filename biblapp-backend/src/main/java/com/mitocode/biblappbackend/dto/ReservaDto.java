package com.mitocode.biblappbackend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mitocode.biblappbackend.enums.EstadoReserva;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReservaDto {

    private Integer id;

    @NotNull(message = "La fecha de reserva es requerida")
    private LocalDateTime fechaReserva;

    private EstadoReserva estado = EstadoReserva.PENDIENTE;

    @Size(max = 500, message = "La observación no debe exceder 500 caracteres")
    private String observacion;

    private LocalDateTime fechaCreacion;

    @NotNull(message = "El cliente es requerido")
    private ClienteDto cliente;

    @NotEmpty(message = "La reserva debe contener al menos un libro")
    @Valid
    private List<DetalleReservaDto> detallesReserva;

    public Integer getIdReserva() {
        return this.id;
    }

    public void setIdReserva(Integer idReserva) {
        this.id = idReserva;
    }
}
