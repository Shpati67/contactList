package com.contact.contactapi.resource;
import com.contact.contactapi.domain.Contact;
import com.contact.contactapi.domain.PageModel;
import com.contact.contactapi.domain.StringResponse;
import com.contact.contactapi.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static com.contact.contactapi.constant.Constant.PHOTO_DIRECTORY;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactResource {
    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<Contact> createContact(Authentication authentication, @RequestBody Contact contact) {
        String username = authentication.getName();
        System.out.println(username);
        Contact savedContact = contactService.createContact(username, contact);
        return ResponseEntity.created(URI.create("/contacts/" + username)).body(savedContact);
    }

    @GetMapping
    public PageModel<Contact> getAllContacts(
            Authentication authentication,
            @RequestParam(name = "page", defaultValue = "1") Integer page,
            @RequestParam(name = "size", defaultValue = "10") Integer size,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection,
            @RequestParam(name = "sortKey", defaultValue = "name") String sortKey,
            @RequestParam(name = "q", defaultValue = "") String q
            ) {
        return contactService.getAllContacts(page, size, sortDirection, sortKey, q, authentication.getName());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContact(@PathVariable(value = "id") String id) {
        return ResponseEntity.ok().body(contactService.getContactById(id));
    }

    @GetMapping("/contacts/search")
    public ResponseEntity<List<Contact>> searchContacts(@RequestParam String query) {
        List<Contact> contacts = contactService.searchContacts(query);
        return ResponseEntity.ok(contacts);
    }

    @PutMapping("/photo")
    public StringResponse uploadPhoto(@RequestParam("id") String id,
                                      @RequestParam("file") MultipartFile file) {
        return contactService.uploadPhoto(id, file);
    }

    @GetMapping(path = "/image/{filename}", produces = {IMAGE_PNG_VALUE, IMAGE_JPEG_VALUE})
    public byte[] getPhoto(@PathVariable(value = "filename") String filename) throws IOException {
        return Files.readAllBytes(Paths.get(PHOTO_DIRECTORY + filename));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(@PathVariable("id") String id, @RequestBody Contact contact) {
        return ResponseEntity.ok().body(contactService.updateContact(id,contact));
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<String> deleteContact(@PathVariable("id") String id) {
        boolean isRemoved = contactService.deleteContactById(id);
        if (!isRemoved) {
            return new ResponseEntity<>("Contact not found", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>("Contact deleted successfully", HttpStatus.OK);
    };
}
