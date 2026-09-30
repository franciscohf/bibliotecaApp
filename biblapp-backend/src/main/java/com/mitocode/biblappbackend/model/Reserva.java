package com.mitocode.biblappbackend.model;

import com.mitocode.biblappbackend.enums.EstadoReserva;
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
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(nullable = false)
    private LocalDateTime fechaReserva;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoReserva estado = EstadoReserva.PENDIENTE;

    @Column(length = 500)
    private String observacion;


    @Column(nullable = false , updatable = false)
    private LocalDateTime fechaCreacion;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id",nullable = false,foreignKey = @ForeignKey(name = "fk_reserva_cliente"))
    private Cliente cliente;

    @OneToMany(mappedBy = "reserva",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<DetalleReserva> detallesReserva = new ArrayList<>();


    @PrePersist
    protected void prePersist() {
        fechaCreacion = LocalDateTime.now();
    }

    public Integer getIdReserva() {
        return this.id;
    }
    public void setIdReserva(Integer idReserva) {
        this.id = idReserva;
    }
    public void addDetalle(DetalleReserva detalle) {
        if (this.detallesReserva == null) {
            this.detallesReserva = new ArrayList<>();
        }
        this.detallesReserva.add(detalle);
        detalle.setReserva(this);
    }
}
