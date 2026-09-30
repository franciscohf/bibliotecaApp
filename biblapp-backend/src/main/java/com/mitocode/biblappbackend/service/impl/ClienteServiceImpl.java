package com.mitocode.biblappbackend.service.impl;

import com.mitocode.biblappbackend.model.Cliente;
import com.mitocode.biblappbackend.repo.IClienteRepo;
import com.mitocode.biblappbackend.repo.IGenericRepo;
import com.mitocode.biblappbackend.service.IClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClienteServiceImpl extends CRUDImpl<Cliente, Integer> implements IClienteService {
private final IClienteRepo iClienteRepo;
    @Override
    protected IGenericRepo<Cliente, Integer> getRepo() {
        return iClienteRepo;
    }


}
