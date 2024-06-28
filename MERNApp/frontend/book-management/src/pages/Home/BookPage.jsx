import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import imagePlaceHolder from '../../assets/No-Image-Placeholder.svg'

const BookPage = () => {
  const { title } = useParams();
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await axiosInstance.get(`/books/${title}`);
        setBook(response.data.book);
        setComments(response.data.book.comments);
      } catch (error) {
        console.error('Error fetching book data:', error);
      }
    };
    fetchBookData();
  }, [title]);//fetch data as soon as the title param is loaded in

  const handleCommentSubmit = async () => {
    try {
      if (book && book._id) {
        const bookId = book._id; // Fetch and assign the bookId value
  
        await axiosInstance.put("add-comment/" + bookId, { content: commentText });
        console.log("Comment added successfully");

        const response = await axiosInstance.get(`/books/${title}`);//refetching the new data to get the comment
        setBook(response.data.book);//setting the new book data, included the new comment
        setComments(response.data.book.comments);
        setCommentText('');
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <BookContainer>
        <ProductImage src={book.imageUrl || imagePlaceHolder} alt={book.title} />
      <BookDetails>
        <BookTitle>{book.title}</BookTitle>
        <BookAuthor>by {book.author}</BookAuthor>
        <BookPublishedYear>Published in {book.publishedYear}</BookPublishedYear>
        <BookContent>{book.content}</BookContent>
        <CommentsSection>
          <h3>Reader Reviews</h3>
          <CommentInput
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
          />
          <SubmitButton onClick={handleCommentSubmit}>Submit</SubmitButton>
          {comments.map((comment) => (
            <Comment key={comment._id}>
              <CommentText>
                <strong>{comment.userId}:</strong> {comment.content}
              </CommentText>
            </Comment>
          ))}
        </CommentsSection>
      </BookDetails>
    </BookContainer>
  );
};

export default BookPage;

const BookContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f6f6f6;
`;

const ProductImage = styled.img`
  width: 300px;
  height: 450px;
  object-fit: cover;
`;

const BookDetails = styled.div`
  width: 80%;
  max-width: 800px;
  background: #fff;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const BookTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 10px;
`;

const BookAuthor = styled.p`
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const BookPublishedYear = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 15px;
`;

const BookContent = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const CommentsSection = styled.div`
  margin-top: 20px;
`;

const CommentInput = styled.input`
  width: calc(100% - 90px);
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #0073bb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #005fa3;
  }
`;

const Comment = styled.div`
  margin-top: 10px;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 4px;
`;

const CommentText = styled.p`
  margin: 0;
`;

const CommentDate = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #888;
`;
