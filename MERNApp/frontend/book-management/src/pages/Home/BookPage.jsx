import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

const BookPage = () => {
  const { title } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await axiosInstance.get(`/books/${title}`);
        setBook(response.data.book);
      } catch (error) {
        console.error('Error fetching book data:', error);
      }
    };

    fetchBookData();
  }, [title]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <BookContainer>
      <BookCover>
        <BookImage src={book.imageUrl || 'https://via.placeholder.com/200x300'} alt={book.title} />
      </BookCover>
      <BookDetails>
        <BookTitle>{book.title}</BookTitle>
        <BookAuthor>by {book.author}</BookAuthor>
        <BookPublishedYear>Published in {book.publishedYear}</BookPublishedYear>
        <BookContent>{book.content}</BookContent>
      </BookDetails>
    </BookContainer>
  );
};

export default BookPage;

const BookContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const BookCover = styled.div`
  margin-right: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

const BookImage = styled.img`
  width: 200px;
  height: 300px;
`;

const BookDetails = styled.div`
  max-width: 500px;
`;

const BookTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const BookAuthor = styled.p`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const BookPublishedYear = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const BookContent = styled.p`
  font-size: 1.1rem;
  line-height: 1.5;
`;