package com.contact.contactapi.specifications;
import com.contact.contactapi.domain.Contact;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class ContactSpecification implements Specification<Contact> {
    private String q;
    private String username;

    @Override
    public Predicate toPredicate(Root<Contact> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();


        if (q != null) {
            Predicate namePredicate = criteriaBuilder.like(root.get("name"), "%" + q + "%");
            Predicate emailPredicate = criteriaBuilder.like(root.get("email"), "%" + q + "%");
            predicates.add(criteriaBuilder.or(namePredicate, emailPredicate));
        }

        if (username != null) {
            Predicate usernamePredicate = criteriaBuilder.like(root.get("username"), "%" + username + "%");
            predicates.add(criteriaBuilder.or(usernamePredicate));
        }


        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }
}