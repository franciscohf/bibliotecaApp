package com.mitocode.biblappbackend.service.impl;

import com.mitocode.biblappbackend.model.User;
import com.mitocode.biblappbackend.repo.IGenericRepo;
import com.mitocode.biblappbackend.repo.IUserRepo;
import com.mitocode.biblappbackend.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl extends CRUDImpl<User, Integer> implements IUserService {

    private final IUserRepo iUserRepo;

    @Override
    protected IGenericRepo<User, Integer> getRepo() {
        return iUserRepo;
    }
}
