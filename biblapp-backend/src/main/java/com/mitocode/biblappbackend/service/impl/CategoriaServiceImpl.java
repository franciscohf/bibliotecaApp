package com.mitocode.biblappbackend.service.impl;

import com.mitocode.biblappbackend.model.Categoria;
import com.mitocode.biblappbackend.repo.ICategoriaRepo;
import com.mitocode.biblappbackend.repo.IGenericRepo;
import com.mitocode.biblappbackend.service.ICategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoriaServiceImpl extends CRUDImpl<Categoria, Integer> implements ICategoriaService {
private final ICategoriaRepo iCategoriaRepo;
    @Override
    protected IGenericRepo<Categoria, Integer> getRepo() {
        return iCategoriaRepo;
    }


}
