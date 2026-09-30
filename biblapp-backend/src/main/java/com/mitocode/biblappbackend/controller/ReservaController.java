package com.mitocode.biblappbackend.controller;

import com.mitocode.biblappbackend.dto.ReservaDto;
import com.mitocode.biblappbackend.model.Reserva;
import com.mitocode.biblappbackend.service.IReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mitocode.biblappbackend.enums.EstadoReserva;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping({"/v1/reserva"})
public class ReservaController {

    private final IReservaService reservaService;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<ReservaDto>> findAll() throws Exception {
        List<ReservaDto> list = reservaService.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaDto> findById(@PathVariable Integer id) throws Exception {
        ReservaDto obj = convertToDto(reservaService.findById(id));
        return ResponseEntity.ok(obj);
    }

    @PostMapping
    public ResponseEntity<Reserva> save(@Valid @RequestBody ReservaDto dto) throws Exception {
        Reserva obj = reservaService.save(convertToEntity(dto));

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getId()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservaDto> update(@PathVariable Integer id, @Valid @RequestBody ReservaDto dto) throws Exception {
        Reserva obj = reservaService.update(id, convertToEntity(dto));
        return ResponseEntity.ok(convertToDto(obj));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<ReservaDto> cambiarEstado(@PathVariable Integer id, @RequestParam EstadoReserva estado) throws Exception {
        Reserva obj = reservaService.cambiarEstado(id, estado);
        return ResponseEntity.ok(convertToDto(obj));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception {
        reservaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/search/others")
    public ResponseEntity<List<ReservaDto>> searchByOthers(@RequestBody com.mitocode.biblappbackend.dto.FilterReservaDto filter) throws Exception {
        String cedula = filter != null ? filter.cedula() : null;
        String fullname = filter != null ? filter.fullname() : null;
        List<ReservaDto> list = reservaService.search(cedula, fullname)
                .stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/search/dates")
    public ResponseEntity<List<ReservaDto>> searchByDates(
            @RequestParam(name = "date1") String date1,
            @RequestParam(name = "date2") String date2
    ) throws Exception {
        java.time.LocalDateTime d1 = java.time.LocalDateTime.parse(date1);
        java.time.LocalDateTime d2 = java.time.LocalDateTime.parse(date2);
        List<ReservaDto> list = reservaService.searchByDates(d1, d2)
                .stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    private Reserva convertToEntity(ReservaDto dto) {
        return defaultMapper.map(dto, Reserva.class);
    }

    private ReservaDto convertToDto(Reserva obj) {
        return defaultMapper.map(obj, ReservaDto.class);
    }
}
