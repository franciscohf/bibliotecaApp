package com.mitocode.biblappbackend.service.impl;

import com.mitocode.biblappbackend.enums.EstadoReserva;
import com.mitocode.biblappbackend.exception.ModelNotFoundException;
import com.mitocode.biblappbackend.model.Cliente;
import com.mitocode.biblappbackend.model.DetalleReserva;
import com.mitocode.biblappbackend.model.Libro;
import com.mitocode.biblappbackend.model.Reserva;
import com.mitocode.biblappbackend.repo.IClienteRepo;
import com.mitocode.biblappbackend.repo.IGenericRepo;
import com.mitocode.biblappbackend.repo.ILibroRepo;
import com.mitocode.biblappbackend.repo.IReservaRepo;
import com.mitocode.biblappbackend.service.IReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaServiceImpl extends CRUDImpl<Reserva, Integer> implements IReservaService {

    private final IReservaRepo iReservaRepo;
    private final IClienteRepo clienteRepo;
    private final ILibroRepo libroRepo;

    @Override
    protected IGenericRepo<Reserva, Integer> getRepo() {
        return iReservaRepo;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reserva> findAll() throws Exception {
        return iReservaRepo.findAllWithDetails();
    }

    @Override
    @Transactional(readOnly = true)
    public Reserva findById(Integer id) throws Exception {
        return iReservaRepo.findByIdWithDetails(id)
                .orElseThrow(() -> new ModelNotFoundException("ID NOT FOUND: " + id));
    }

    @Override
    @Transactional
    public Reserva save(Reserva entity) throws Exception {
        if (entity.getDetallesReserva() == null || entity.getDetallesReserva().isEmpty()) {
            throw new ModelNotFoundException("La reserva debe contener al menos un libro en el detalle");
        }

        if (entity.getCliente() == null || entity.getCliente().getId() == null) {
            throw new ModelNotFoundException("El cliente es requerido");
        }

        // Validar cliente
        Cliente cliente = clienteRepo.findById(entity.getCliente().getId())
                .orElseThrow(() -> new ModelNotFoundException("Cliente no encontrado con ID: " + entity.getCliente().getId()));
        entity.setCliente(cliente);

        // Asignar relación bidireccional y validar libros
        for (DetalleReserva detalle : entity.getDetallesReserva()) {
            if (detalle.getLibro() == null || detalle.getLibro().getId() == null) {
                throw new ModelNotFoundException("El libro es requerido en el detalle");
            }

            Libro libro = libroRepo.findById(detalle.getLibro().getId())
                    .orElseThrow(() -> new ModelNotFoundException("Libro no encontrado con ID: " + detalle.getLibro().getId()));

            if (!Boolean.TRUE.equals(libro.getDisponible())) {
                throw new IllegalStateException("El libro '" + libro.getTitulo() + "' no se encuentra disponible para reserva");
            }
            detalle.setLibro(libro);
            detalle.setReserva(entity);
        }

        if (entity.getEstado() == null) {
            entity.setEstado(EstadoReserva.PENDIENTE);
        }

        return iReservaRepo.save(entity);
    }

    @Override
    @Transactional
    public Reserva update(Integer id, Reserva entity) throws Exception {
        Reserva existing = findById(id);
        if (entity.getEstado() != null) {
            existing.setEstado(entity.getEstado());
        }
        if (entity.getObservacion() != null) {
            existing.setObservacion(entity.getObservacion());
        }
        if (entity.getFechaReserva() != null) {
            existing.setFechaReserva(entity.getFechaReserva());
        }
        return iReservaRepo.save(existing);
    }

    @Override
    @Transactional
    public Reserva cambiarEstado(Integer id, EstadoReserva estado) throws Exception {
        Reserva reserva = findById(id);
        reserva.setEstado(estado);
        return iReservaRepo.save(reserva);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reserva> search(String cedula, String fullname) throws Exception {
        String cleanCedula = (cedula != null && !cedula.trim().isEmpty()) ? cedula.trim() : null;
        String cleanFullname = (fullname != null && !fullname.trim().isEmpty()) ? fullname.trim().toLowerCase() : null;
        return iReservaRepo.search(cleanCedula, cleanFullname);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reserva> searchByDates(java.time.LocalDateTime date1, java.time.LocalDateTime date2) throws Exception {
        return iReservaRepo.searchByDates(date1, date2);
    }
}
