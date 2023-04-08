import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Row, Col, Button, Form} from 'react-bootstrap'

const BookPage = () => {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [is_end, setIs_end] = useState(false);
    const [query, setQuery] = useState('리액트');


    const getBooks = async () => {
        const url = "https://dapi.kakao.com/v3/search/book?target=title";
        const config = {
            headers: { "Authorization": "KakaoAK b5f172f67829ad1c75f139bb7413db11" },
            params: { "query": "리액트", "size": 6, "page": 1 }
        }
        setLoading(true)
        const result = await axios.get(url, config)

        const data=result.data.documents.map(book=>{
            const fmtPrice=book.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return { ...book, fmtPrice:fmtPrice, show:false }
        })

        setBooks(result.data.documents)
        setTotal(result.data.meta.pageable_count);
        setIs_end(result.data.meta.is_end);
        console.log(result);
        setLoading(false)
    }

    useEffect(() => {
        getBooks();
    }, [page])
    const onSearch = () => {
        setPage(1);
        getBooks();
    }
    if (loading) return <h1 className='text-center my-5' >로딩중</h1>
    return (
        <Row>
            <h1 className='text-center mb-5'>도서검색</h1>
            <Row className='my-2'>
                <Col xs={6} md={2}>
                    <Form onSubmit={ onSearch }>
                        <Form.Control value={query} placeholder='검색어'
                            onChange={(e)=>setQuery(e.target.value)}/>
                    </Form>
                </Col>
                <Col>검색수: {total}건</Col>
            </Row>
            <hr/>
            <Row className='my-2 justify-content-center'>
                {books.map(book=>
                    <Col key={book.isbn} className='m-2 box'>
                        <div><img src={!book.thumbnail ? 'http://via.placeholder.com/120x170':book.thumbnail}/></div>
                        <div className="ellipsis">{book.title}</div>
                        <div>{book.fmtPrice}원</div>
                        <div class="ellipsis">{book.authors}</div>
                        
                    </Col>
                )}
            </Row>
            <div className='text-center my-3'>
                <Button disabled={page === 1 && true}
                    onClick={()=>setPage(page-1)}>이전</Button>
                <span className='mx-2'>{page}</span>
                <Button disabled={is_end}
                    onClick={()=>setPage(page+1)}>다음</Button>
            </div>
        </Row>
    )
}

export default BookPage