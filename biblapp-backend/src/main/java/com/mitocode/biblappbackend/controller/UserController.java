package com.mitocode.biblappbackend.controller;

import com.mitocode.biblappbackend.dto.UserDto;
import com.mitocode.biblappbackend.model.User;
import com.mitocode.biblappbackend.service.IUserService;
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
@RequestMapping({"/v1/user"})
public class UserController {

    private final IUserService userService;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<UserDto>> findAll() throws Exception {
        List<UserDto> list = userService.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> findById(@PathVariable Integer id) throws Exception {
        UserDto obj = convertToDto(userService.findById(id));
        return ResponseEntity.ok(obj);
    }

    @PostMapping
    public ResponseEntity<User> save(@Valid @RequestBody UserDto dto) throws Exception {
        User obj = userService.save(convertToEntity(dto));

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getIdUser()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Integer id, @Valid @RequestBody UserDto dto) throws Exception {
        User obj = userService.update(id, convertToEntity(dto));
        return ResponseEntity.ok(obj);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private User convertToEntity(UserDto dto) {
        return defaultMapper.map(dto, User.class);
    }

    private UserDto convertToDto(User obj) {
        return defaultMapper.map(obj, UserDto.class);
    }
}
