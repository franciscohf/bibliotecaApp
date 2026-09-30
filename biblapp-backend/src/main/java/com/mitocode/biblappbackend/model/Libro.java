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
public class Libro {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, length = 150)
    private String autor;

    @Column(nullable = false, length = 20, unique = true)
    private String isbn;

    @Column(nullable = false)
    private Boolean disponible = true;

    @Column(length = 150)
    private String editorial;

    private Integer anioPublicacion;

    @Column(nullable = false)
    private Integer cantidadEjemplares = 1;

    @Column(length = 250)
    private String photoUrl;

    @Column(nullable = false,updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(nullable = false)
    private LocalDateTime fechaModificacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id",nullable = false,foreignKey = @ForeignKey(name = "fk_libro_categoria"))
    private Categoria categoria;

    @OneToMany(mappedBy = "libro")
    private List<DetalleReserva> detallesReserva = new ArrayList<>();

    public Integer getIdLibro() {
        return this.id;
    }

    public void setIdLibro(Integer idLibro) {
        this.id = idLibro;
    }

    @PrePersist
    protected void prePersist() {
        fechaCreacion = LocalDateTime.now();
        fechaModificacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void preUpdate() {
        fechaModificacion = LocalDateTime.now();
    }
}
