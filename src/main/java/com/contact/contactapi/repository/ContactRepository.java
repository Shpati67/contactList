package com.contact.contactapi.repository;
import com.contact.contactapi.domain.Contact;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, String> {
    @NonNull
    Optional<Contact> findById(@NonNull String id);
    List<Contact> findAll(Specification<Contact> spec, Pageable pageable);
    Long count(Specification<Contact> spec);
}
