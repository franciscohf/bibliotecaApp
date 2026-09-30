package com.mitocode.biblappbackend.controller;

import com.mitocode.biblappbackend.dto.CategoriaDto;
import com.mitocode.biblappbackend.model.Categoria;
import com.mitocode.biblappbackend.service.ICategoriaService;
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
@RequestMapping("/v1/categoria")
public class CategoriaController {
    private final ICategoriaService categoService;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<CategoriaDto>> findAll() throws Exception {
        List<CategoriaDto> list = categoService.findAll().stream().map(this::convertToDto).collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDto> findById(@PathVariable Integer id) throws Exception {
        CategoriaDto obj = convertToDto(categoService.findById(id));

        return ResponseEntity.ok(obj);
    }

    @PostMapping
    public ResponseEntity<Categoria> save(@Valid @RequestBody CategoriaDto dto) throws Exception{
        Categoria obj = categoService.save(convertToEntity(dto));

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getId()).toUri();

        return ResponseEntity.created(location).build();

    }

    @PutMapping("/{id}")
    public ResponseEntity<Categoria> update(@PathVariable Integer id, @Valid @RequestBody CategoriaDto dto) throws Exception{

        Categoria obj = categoService.update(id, convertToEntity(dto));
        return ResponseEntity.ok(obj);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception{
        categoService.delete(id);

        return ResponseEntity.noContent().build();
    }

    private Categoria convertToEntity(CategoriaDto dto) {
        return defaultMapper.map(dto, Categoria.class);
    }

    private CategoriaDto convertToDto(Categoria obj) {
        return defaultMapper.map(obj, CategoriaDto.class);
    }
}
