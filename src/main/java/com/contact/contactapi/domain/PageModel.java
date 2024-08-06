package com.contact.contactapi.domain;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageModel<T> {

    long page;
    long total;
    long size;
    String sortedKey;
    private List<T> data;
}