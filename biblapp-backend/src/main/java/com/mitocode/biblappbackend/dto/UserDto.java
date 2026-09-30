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
public class UserDto {

    private Integer idUser;

    @NotNull
    @Size(min = 3, max = 60)
    private String username;

    @NotNull
    @Size(min = 1, max = 36)
    private String supabaseUserId;

    private Boolean enabled;

    private List<RoleDto> roles;

    public Integer getId() {
        return this.idUser;
    }

    public void setId(Integer id) {
        this.idUser = id;
    }
}
