package com.mitocode.biblappbackend.service.impl;

import com.mitocode.biblappbackend.model.Libro;
import com.mitocode.biblappbackend.repo.IGenericRepo;
import com.mitocode.biblappbackend.repo.ILibroRepo;
import com.mitocode.biblappbackend.service.ILibroService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LibroServiceImpl extends CRUDImpl<Libro, Integer> implements ILibroService {

    private final ILibroRepo iLibroRepo;

    @Value("${supabase.url:${app.supabase.url:https://nhhpaglftuqsopmbgoxq.supabase.co}}")
    private String supabaseUrl;

    @Value("${supabase.key:${app.supabase.service-role-key:}}")
    private String supabaseKey;

    @Value("${supabase.bucket:${app.supabase.bucket:photos}}")
    private String supabaseBucket;

    @Value("${supabase.max-photo-size:${app.supabase.max-photo-size:2097152}}")
    private long maxPhotoSize;

    private final RestClient restClient = RestClient.builder().build();

    @Override
    protected IGenericRepo<Libro, Integer> getRepo() {
        return iLibroRepo;
    }

    @Override
    public Libro save(Libro libro) throws Exception {
        return save(libro, null);
    }

    @Override
    public Libro update(Integer id, Libro libro) throws Exception {
        return update(id, libro, null);
    }

    @Override
    public Libro save(Libro libro, MultipartFile file) throws Exception {
        validateFile(file);

        if (file != null && !file.isEmpty()) {
            String publicUrl = uploadToStorage(file);
            libro.setPhotoUrl(publicUrl);
        } else if (libro.getPhotoUrl() != null && libro.getPhotoUrl().isBlank()) {
            libro.setPhotoUrl(null);
        }

        return super.save(libro);
    }

    @Override
    public Libro update(Integer id, Libro libro, MultipartFile file) throws Exception {
        validateFile(file);

        Libro existing = findById(id);

        if (file != null && !file.isEmpty()) {
            if (existing.getPhotoUrl() != null && !existing.getPhotoUrl().isBlank()) {
                deleteFromStorage(existing.getPhotoUrl());
            }
            String publicUrl = uploadToStorage(file);
            libro.setPhotoUrl(publicUrl);
        } else {
            if (libro.getPhotoUrl() == null || libro.getPhotoUrl().isBlank()) {
                libro.setPhotoUrl(existing.getPhotoUrl());
            }
        }

        libro.setId(id);
        return getRepo().save(libro);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return;
        }

        if (file.getSize() > maxPhotoSize) {
            throw new IllegalArgumentException("File exceeds maximum allowed size of 2MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image (image/*)");
        }
    }

    private String uploadToStorage(MultipartFile file) throws Exception {
        String ext = extractExtension(file);
        String objectPath = "libros/" + UUID.randomUUID() + "." + ext;
        String uploadUrl = String.format("%s/storage/v1/object/%s/%s", supabaseUrl, supabaseBucket, objectPath);

        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (file.getContentType() != null && !file.getContentType().isBlank()) {
            mediaType = MediaType.parseMediaType(file.getContentType());
        }

        restClient.post()
                .uri(uploadUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + supabaseKey)
                .header("apikey", supabaseKey)
                .contentType(mediaType)
                .body(file.getBytes())
                .retrieve()
                .toBodilessEntity();

        return String.format("%s/storage/v1/object/public/%s/%s", supabaseUrl, supabaseBucket, objectPath);
    }

    private void deleteFromStorage(String photoUrl) {
        if (photoUrl == null || photoUrl.isBlank()) {
            return;
        }

        try {
            String prefix = "/storage/v1/object/public/" + supabaseBucket + "/";
            String objectPath;

            if (photoUrl.contains(prefix)) {
                objectPath = photoUrl.substring(photoUrl.indexOf(prefix) + prefix.length());
            } else if (photoUrl.contains("/" + supabaseBucket + "/libros/")) {
                objectPath = photoUrl.substring(photoUrl.indexOf("/" + supabaseBucket + "/") + ("/" + supabaseBucket + "/").length());
            } else if (photoUrl.contains("/libros/")) {
                objectPath = photoUrl.substring(photoUrl.indexOf("/libros/") + 1);
            } else {
                return;
            }

            String deleteUrl = String.format("%s/storage/v1/object/%s/%s", supabaseUrl, supabaseBucket, objectPath);

            restClient.delete()
                    .uri(deleteUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + supabaseKey)
                    .header("apikey", supabaseKey)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Deleted previous photo from Supabase Storage: {}", objectPath);
        } catch (Exception e) {
            log.warn("Could not delete previous photo from Supabase Storage: {}", e.getMessage());
        }
    }

    private String extractExtension(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null && originalFilename.lastIndexOf('.') != -1) {
            return originalFilename.substring(originalFilename.lastIndexOf('.') + 1).toLowerCase();
        }

        String contentType = file.getContentType();
        if (contentType != null && contentType.contains("/")) {
            String sub = contentType.substring(contentType.indexOf('/') + 1).toLowerCase();
            if (sub.equals("jpeg")) {
                return "jpg";
            }
            return sub;
        }

        return "jpg";
    }
}
