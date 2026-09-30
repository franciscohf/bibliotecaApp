package com.mitocode.biblappbackend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MenuDto {

    private Integer idMenu;

    @NotNull
    @Size(min = 1, max = 20)
    private String icon;

    @NotNull
    @Size(min = 1, max = 20)
    private String name;

    @NotNull
    @Size(min = 1, max = 50)
    private String url;

    private List<RoleDto> roles;

    public Integer getId() {
        return this.idMenu;
    }

    public void setId(Integer id) {
        this.idMenu = id;
    }
}
