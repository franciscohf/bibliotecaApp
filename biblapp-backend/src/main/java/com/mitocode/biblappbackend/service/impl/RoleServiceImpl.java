package com.mitocode.biblappbackend.service.impl;

import com.mitocode.biblappbackend.model.Role;
import com.mitocode.biblappbackend.repo.IGenericRepo;
import com.mitocode.biblappbackend.repo.IRoleRepo;
import com.mitocode.biblappbackend.service.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl extends CRUDImpl<Role, Integer> implements IRoleService {

    private final IRoleRepo iRoleRepo;

    @Override
    protected IGenericRepo<Role, Integer> getRepo() {
        return iRoleRepo;
    }
}
