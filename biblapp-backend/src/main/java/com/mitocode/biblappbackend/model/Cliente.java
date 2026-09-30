package com.mitocode.biblappbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(nullable = false, length = 30, unique = true)
    private String cedula;

    @Column(nullable = false, length = 150, unique = true)
    private String email;

    @Column(length = 30)
    private String telefono;

    @Column(nullable = false)
    private Boolean estado = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @OneToMany(mappedBy = "cliente")
    private List<Reserva> reservas = new ArrayList<>();

    @PrePersist
    protected void prePersist() {
        fechaRegistro = LocalDateTime.now();
    }
}
