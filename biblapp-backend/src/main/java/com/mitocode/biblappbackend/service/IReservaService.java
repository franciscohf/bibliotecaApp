package com.mitocode.biblappbackend.service;

import com.mitocode.biblappbackend.enums.EstadoReserva;
import com.mitocode.biblappbackend.model.Reserva;

public interface IReservaService extends ICRUD<Reserva, Integer> {
    Reserva cambiarEstado(Integer id, EstadoReserva estado) throws Exception;
    java.util.List<Reserva> search(String cedula, String fullname) throws Exception;
    java.util.List<Reserva> searchByDates(java.time.LocalDateTime date1, java.time.LocalDateTime date2) throws Exception;
}
