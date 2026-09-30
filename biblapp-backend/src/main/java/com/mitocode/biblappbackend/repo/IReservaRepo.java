package com.mitocode.biblappbackend.repo;

import com.mitocode.biblappbackend.model.Reserva;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IReservaRepo extends IGenericRepo<Reserva, Integer> {

    @Query("SELECT DISTINCT r FROM Reserva r " +
           "LEFT JOIN FETCH r.cliente " +
           "LEFT JOIN FETCH r.detallesReserva d " +
           "LEFT JOIN FETCH d.libro l " +
           "LEFT JOIN FETCH l.categoria " +
           "ORDER BY r.id DESC")
    List<Reserva> findAllWithDetails();

    @Query("SELECT r FROM Reserva r " +
           "LEFT JOIN FETCH r.cliente " +
           "LEFT JOIN FETCH r.detallesReserva d " +
           "LEFT JOIN FETCH d.libro l " +
           "WHERE r.id = :id")
    Optional<Reserva> findByIdWithDetails(@Param("id") Integer id);

    @Query("SELECT DISTINCT r FROM Reserva r " +
           "LEFT JOIN FETCH r.cliente c " +
           "LEFT JOIN FETCH r.detallesReserva d " +
           "LEFT JOIN FETCH d.libro l " +
           "LEFT JOIN FETCH l.categoria " +
           "WHERE c.cedula = :cedula " +
           "   OR LOWER(c.nombres) LIKE %:fullname% " +
           "   OR LOWER(c.apellidos) LIKE %:fullname%")
    List<Reserva> search(@Param("cedula") String cedula, @Param("fullname") String fullname);

    @Query("SELECT DISTINCT r FROM Reserva r " +
           "LEFT JOIN FETCH r.cliente c " +
           "LEFT JOIN FETCH r.detallesReserva d " +
           "LEFT JOIN FETCH d.libro l " +
           "LEFT JOIN FETCH l.categoria " +
           "WHERE r.fechaReserva BETWEEN :date1 AND :date2 " +
           "ORDER BY r.fechaReserva DESC")
    List<Reserva> searchByDates(@Param("date1") java.time.LocalDateTime date1, @Param("date2") java.time.LocalDateTime date2);
}
