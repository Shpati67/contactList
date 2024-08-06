package com.contact.contactapi.service;
import com.contact.contactapi.domain.Contact;
import com.contact.contactapi.domain.PageModel;
import com.contact.contactapi.domain.StringResponse;
import com.contact.contactapi.domain.User;
import com.contact.contactapi.repository.ContactRepository;
import com.contact.contactapi.repository.UserRepository;
import com.contact.contactapi.specifications.ContactSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import static com.contact.contactapi.constant.Constant.PHOTO_DIRECTORY;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class ContactService {
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public Page<Contact> getAllContacts(int page, int size) {
        return contactRepository.findAll(PageRequest.of(page, size, Sort.by("name")));
    }

    public Contact getContactById(String id) {
        return contactRepository.findById(id).orElseThrow(() -> new RuntimeException("Contact not found!"));
    }

    public Contact createContact(String username, Contact contact) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found!");
        }
        contact.setUsername(user.getUsername());
        return contactRepository.save(contact);
    }

    @Transactional
    public PageModel<Contact> getAllContacts(Integer page, Integer size, String sortDirection, String sortKey, String q, String username) {

        if (!sortDirection.equals("ASC") && !sortDirection.equals("DESC")) {
            sortDirection = "ASC";
        }

        page --;

        if (page < 0) {
            page = 0;
        }

        if (size <= 0) {
            size = 10;
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortKey));

        if (sortDirection.equals("DESC")) {
            pageable = PageRequest.of(page, size, Sort.by(sortKey).descending());
        }
        ContactSpecification contactSpecification = new ContactSpecification(q, username);

        List<Contact> contacts = contactRepository.findAll(contactSpecification, pageable);
        long total = contactRepository.count(contactSpecification);

        System.out.println(contacts);

        Page<Contact> contactPage = new PageImpl<>(contacts, pageable, contacts.size());

        return PageModel.<Contact>builder()
                .total(total)
                .size(contactPage.getSize())
                .page(contactPage.getNumber() + 1)
                .data(contactPage.stream().toList())
                .sortedKey(sortKey)
                .build();
    }

    public StringResponse uploadPhoto(String id, MultipartFile file) {
        log.info("Saving picture for user ID: {}", id);
        Contact contact = getContactById(id);
        String fileName = file.getOriginalFilename(); // Get the filename from the MultipartFile
        String fileExtension = getFileExtension(fileName); // Extract the file extension
        String photoUrl = id + fileExtension; // Combine the id with the file extension
        savePhoto(id, file, photoUrl);
        String fullPhotoUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/contacts/image/")
                .path(photoUrl)
                .toUriString();// Save the photo with the generated photo URL
        contact.setPhotoUrl(fullPhotoUrl); // Set the photo URL in the contact
        contactRepository.save(contact); // Save the contact
//        return photoUrl; // Return the photo URL

//        Building and returning the uri for the image
        StringResponse respone = new StringResponse();
        respone.setPhotoUrl(fullPhotoUrl);
        return respone;
    }

    //    Extract the file extension
    private String getFileExtension(String filename) {
        return Optional.of(filename)
                .filter(name -> name.contains("."))
                .map(name -> "." + name.substring(filename.lastIndexOf(".") + 1))
                .orElse(".png");
    }

    private void savePhoto(String id, MultipartFile image, String photoUrl) {
        try {
            Path fileStorageLocation = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();

            if (!Files.exists(fileStorageLocation)) {
                Files.createDirectories(fileStorageLocation);
            }

            Files.copy(image.getInputStream(), fileStorageLocation.resolve(photoUrl), REPLACE_EXISTING);
        } catch (Exception exception) {
            throw new RuntimeException("Could not upload photo!", exception);
        }
    }

    public boolean deleteContactById(String id) {
        if (contactRepository.existsById(id)) {
            contactRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    public Contact updateContact(String id, Contact contact) {
        Optional<Contact> optionalContact = contactRepository.findById(id);
        if (optionalContact.isPresent()) {
            Contact existingContact = optionalContact.get();
            existingContact.setName(contact.getName());
            existingContact.setTitle(contact.getTitle());
            existingContact.setEmail(contact.getEmail());
            existingContact.setPhone(contact.getPhone());
            existingContact.setAddress(contact.getAddress());
            existingContact.setStatus(contact.getStatus());
            existingContact.setPhotoUrl(contact.getPhotoUrl());
            return contactRepository.save(existingContact);
        } else {
            throw new RuntimeException("Contact with id " + id +  " not found!");
        }
    }
}

















