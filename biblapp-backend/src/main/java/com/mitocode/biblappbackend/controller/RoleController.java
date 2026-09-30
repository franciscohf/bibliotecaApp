package com.mitocode.biblappbackend.controller;

import com.mitocode.biblappbackend.dto.RoleDto;
import com.mitocode.biblappbackend.model.Role;
import com.mitocode.biblappbackend.service.IRoleService;
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
@RequestMapping({"/v1/role"})
public class RoleController {

    private final IRoleService roleService;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<RoleDto>> findAll() throws Exception {
        List<RoleDto> list = roleService.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleDto> findById(@PathVariable Integer id) throws Exception {
        RoleDto obj = convertToDto(roleService.findById(id));
        return ResponseEntity.ok(obj);
    }

    @PostMapping
    public ResponseEntity<Role> save(@Valid @RequestBody RoleDto dto) throws Exception {
        Role obj = roleService.save(convertToEntity(dto));

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getIdRole()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Role> update(@PathVariable Integer id, @Valid @RequestBody RoleDto dto) throws Exception {
        Role obj = roleService.update(id, convertToEntity(dto));
        return ResponseEntity.ok(obj);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception {
        roleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Role convertToEntity(RoleDto dto) {
        return defaultMapper.map(dto, Role.class);
    }

    private RoleDto convertToDto(Role obj) {
        return defaultMapper.map(obj, RoleDto.class);
    }
}
