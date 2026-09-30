package com.mitocode.biblappbackend.service.impl;

import com.mitocode.biblappbackend.model.Menu;
import com.mitocode.biblappbackend.repo.IGenericRepo;
import com.mitocode.biblappbackend.repo.IMenuRepo;
import com.mitocode.biblappbackend.service.IMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl extends CRUDImpl<Menu, Integer> implements IMenuService {

    private final IMenuRepo iMenuRepo;

    @Override
    protected IGenericRepo<Menu, Integer> getRepo() {
        return iMenuRepo;
    }
}
