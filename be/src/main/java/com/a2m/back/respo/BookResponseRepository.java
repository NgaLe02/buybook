//package com.a2m.back.respo;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
//import org.springframework.stereotype.Repository;
//
//import com.a2m.back.model.resp.BookResponse;
//
//@Repository
//public interface BookResponseRepository extends ElasticsearchRepository<BookResponse, String> {
//	Iterable<BookResponse> findAll();
//
//	Page<BookResponse> findByTitleContaining(String title, Pageable pageable);
//	Page<BookResponse> findByTitle(String title, Pageable pageable);
//	Page<BookResponse> findByAuthor(String title, Pageable pageable);
//}