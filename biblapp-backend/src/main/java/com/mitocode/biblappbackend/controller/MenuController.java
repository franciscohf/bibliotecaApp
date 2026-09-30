package com.mitocode.biblappbackend.controller;

import com.mitocode.biblappbackend.dto.MenuDto;
import com.mitocode.biblappbackend.model.Menu;
import com.mitocode.biblappbackend.service.IMenuService;
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
@RequestMapping({"/v1/menu"})
public class MenuController {

    private final IMenuService menuService;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<MenuDto>> findAll() throws Exception {
        List<MenuDto> list = menuService.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuDto> findById(@PathVariable Integer id) throws Exception {
        MenuDto obj = convertToDto(menuService.findById(id));
        return ResponseEntity.ok(obj);
    }

    @PostMapping
    public ResponseEntity<Menu> save(@Valid @RequestBody MenuDto dto) throws Exception {
        Menu obj = menuService.save(convertToEntity(dto));

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getIdMenu()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Menu> update(@PathVariable Integer id, @Valid @RequestBody MenuDto dto) throws Exception {
        Menu obj = menuService.update(id, convertToEntity(dto));
        return ResponseEntity.ok(obj);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception {
        menuService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Menu convertToEntity(MenuDto dto) {
        return defaultMapper.map(dto, Menu.class);
    }

    private MenuDto convertToDto(Menu obj) {
        return defaultMapper.map(obj, MenuDto.class);
    }
}
