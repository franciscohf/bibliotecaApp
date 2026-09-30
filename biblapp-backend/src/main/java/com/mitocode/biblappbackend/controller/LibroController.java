package com.mitocode.biblappbackend.controller;

import com.mitocode.biblappbackend.dto.LibroDto;
import com.mitocode.biblappbackend.model.Libro;
import com.mitocode.biblappbackend.service.ILibroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping({"/v1/libro"})
public class LibroController {

    private final ILibroService libroService;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<LibroDto>> findAll() throws Exception {
        List<LibroDto> list = libroService.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LibroDto> findById(@PathVariable Integer id) throws Exception {
        LibroDto obj = convertToDto(libroService.findById(id));
        return ResponseEntity.ok(obj);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LibroDto> save(
            @Valid @RequestPart("libro") LibroDto dto,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws Exception {
        Libro obj = libroService.save(convertToEntity(dto), file);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getId()).toUri();

        return ResponseEntity.created(location).body(convertToDto(obj));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LibroDto> saveJson(@Valid @RequestBody LibroDto dto) throws Exception {
        return save(dto, null);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LibroDto> update(
            @PathVariable Integer id,
            @Valid @RequestPart("libro") LibroDto dto,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws Exception {
        Libro obj = libroService.update(id, convertToEntity(dto), file);
        return ResponseEntity.ok(convertToDto(obj));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LibroDto> updateJson(
            @PathVariable Integer id,
            @Valid @RequestBody LibroDto dto
    ) throws Exception {
        return update(id, dto, null);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception {
        libroService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Libro convertToEntity(LibroDto dto) {
        return defaultMapper.map(dto, Libro.class);
    }

    private LibroDto convertToDto(Libro obj) {
        return defaultMapper.map(obj, LibroDto.class);
    }
}

