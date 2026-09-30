package com.mitocode.biblappbackend.service;

import com.mitocode.biblappbackend.model.Libro;
import org.springframework.web.multipart.MultipartFile;

public interface ILibroService extends ICRUD<Libro, Integer> {
    Libro save(Libro libro, MultipartFile file) throws Exception;
    Libro update(Integer id, Libro libro, MultipartFile file) throws Exception;
}
