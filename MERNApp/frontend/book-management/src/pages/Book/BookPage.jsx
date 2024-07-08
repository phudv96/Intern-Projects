import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import imagePlaceHolder from '../../assets/No-Image-Placeholder.svg';
import {MdDelete} from 'react-icons/md';
import { TiArrowBack } from 'react-icons/ti';

const BookPage = () => {
  const { title } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [userInfo, setUserInfo] = useState(null);

const getUserInfo = async() => {
  try{
    const response = await axiosInstance.get("/get-user");
    if(response.data && response.data.user){
      setUserInfo(response.data.user);
    }
  }catch(error){
    if(error.response.status === 401){
      localStorage.clear();
      console.log("please log in");
      navigate("/login");
    }
  }
};

//fetch data as soon as the title param is loaded in
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
    getUserInfo();
  }, [title]);

  //push comment to database
  const handleCommentSubmit = async () => {
    try {
      if (book && book._id) {
        const bookId = book._id; // Fetch and assign the bookId value
  
        await axiosInstance.put("add-comment/" + bookId, { content: commentText });
        console.log("Comment added successfully");

        const response = await axiosInstance.get(`/books/${title}`);//refetching the new data to get the comment
        setBook(response.data.book);//setting the new book data
        setComments(response.data.book.comments);//set new comment to reload the comment section
        setCommentText('');
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  //deleteComment
  const handleDeleteComment = async (commentId) => {
    try {
      const bookId = book._id;
      await axiosInstance.delete(`/delete-comment/${bookId}/${commentId}`);
      console.log("Comment deleted successfully");

      const response = await axiosInstance.get(`/books/${title}`);//refetching the new data to get the comment
      setBook(response.data.book);//setting the new book data
      setComments(response.data.book.comments);//set new comment to reload the comment section
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  
  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <BookContainer>
      <BackButton onClick={() => navigate('/home')}>
        <TiArrowBack />
      </BackButton>
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
          <SubmitButton onClick={handleCommentSubmit}>Comment</SubmitButton>
          {comments.map((comment) => (
            <Comment key={comment._id}>
              <CommentText>
                <strong>{comment.userName}:</strong> {comment.content}
              </CommentText>
              {userInfo && (userInfo.role==='admin' || userInfo._id === comment.userId) &&(
              <DeleteButton onClick={() => handleDeleteComment(comment._id)}>
                <MdDelete />
              </DeleteButton>
              )}
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 4px;
`;

const CommentText = styled.p`
  margin: 0;
  flex: 1;
`;

const CommentDate = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #888;
`;

const DeleteButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5em;
  
  &.icon-btn {
    padding: 0;
    color: inherit;
  }
  
  &:hover {
    color: #f56565;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #0073bb;

  &:hover {
    color: #005fa3;
  }
`;