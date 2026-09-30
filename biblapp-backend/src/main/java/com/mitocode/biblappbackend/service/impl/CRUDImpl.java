package com.mitocode.biblappbackend.service.impl;

import com.mitocode.biblappbackend.exception.ModelNotFoundException;
import com.mitocode.biblappbackend.repo.IGenericRepo;
import com.mitocode.biblappbackend.service.ICRUD;

import java.lang.reflect.Method;
import java.util.List;

public abstract class CRUDImpl<T, ID> implements ICRUD<T, ID> {

    protected abstract IGenericRepo<T, ID> getRepo();

    @Override
    public T save(T entity) throws Exception {
        return getRepo().save(entity);
    }

    @Override
    public T update(ID id, T entity) throws Exception {
        getRepo().findById(id).orElseThrow(() -> new ModelNotFoundException("ID NOT FOUND: " + id));

        String className = entity.getClass().getSimpleName();
        String methodName = "setId" + className;
        Method setIdMethod;
        try {
            setIdMethod = entity.getClass().getMethod(methodName, id.getClass());
        } catch (NoSuchMethodException e) {
            setIdMethod = entity.getClass().getMethod("setId", id.getClass());
        }
        setIdMethod.invoke(entity, id);
        return getRepo().save(entity);
    }

    @Override
    public List<T> findAll() throws Exception {
        return getRepo().findAll();
    }

    @Override
    public T findById(ID id) throws Exception {
        return getRepo().findById(id).orElseThrow(() -> new ModelNotFoundException("ID NOT FOUND: " + id));
    }

    @Override
    public void delete(ID id) throws Exception {
        getRepo().findById(id).orElseThrow(() -> new ModelNotFoundException("ID NOT FOUND: " + id));
        getRepo().deleteById(id);
    }
}
