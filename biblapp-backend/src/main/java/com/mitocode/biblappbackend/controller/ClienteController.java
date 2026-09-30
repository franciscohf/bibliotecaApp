package com.mitocode.biblappbackend.controller;

import com.mitocode.biblappbackend.dto.ClienteDto;
import com.mitocode.biblappbackend.model.Cliente;
import com.mitocode.biblappbackend.service.IClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/cliente")
public class ClienteController {
    private final IClienteService clienteService;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<ClienteDto>> findAll() throws Exception {
        List<ClienteDto> list = clienteService.findAll().stream().map(this::convertToDto).collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDto> findById(@PathVariable Integer id) throws Exception {
        ClienteDto obj = convertToDto(clienteService.findById(id));

        return ResponseEntity.ok(obj);
    }

    @PostMapping
    public ResponseEntity<Cliente> save(@Valid @RequestBody ClienteDto dto) throws Exception{
        Cliente obj = clienteService.save(convertToEntity(dto));

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getId()).toUri();

        return ResponseEntity.created(location).build();

    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> update(@PathVariable Integer id, @Valid @RequestBody ClienteDto dto) throws Exception{
        Cliente obj = clienteService.update(id, convertToEntity(dto));
        return ResponseEntity.ok(obj);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception{
        clienteService.delete(id);

        return ResponseEntity.noContent().build();
    }

    private Cliente convertToEntity(ClienteDto dto) {
        return defaultMapper.map(dto, Cliente.class);
    }

    private ClienteDto convertToDto(Cliente obj) {
        return defaultMapper.map(obj, ClienteDto.class);
    }
}
