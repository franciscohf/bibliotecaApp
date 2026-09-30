package com.mitocode.biblappbackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Role {

    @Id
    @EqualsAndHashCode.Include
    private Integer idRole;

    private String name;

    private String description;

    public Integer getId() {
        return this.idRole;
    }

    public void setId(Integer id) {
        this.idRole = id;
    }
}
