import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Card, ListGroup, Button } from "react-bootstrap";
import ReplyBox from "../../Components/ForumComp/ReplyBox";
import { jwtDecode } from "jwt-decode";
import "./ForumPage.css";

const ForumDetail = () => {
  const { id: postId } = useParams();
  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [currentReplyPage, setCurrentReplyPage] = useState(1);
  const REPLIES_PER_PAGE = 5;
  const repliesSectionRef = useRef(null);
  const isInitialMount = useRef(true);

  const { hash } = useLocation();
  const isNavigatingByHash = useRef(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setUserId(jwtDecode(token).id);
      } catch (error) {
        console.log("Invalid token.");
      }
    }
  }, []);

  const fetchPost = useCallback(() => {
    axios
      .get(`http://localhost:5000/api/forum/${postId}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error(err));
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    if (post && hash) {
      const targetReplyId = hash.replace('#', '');
      const replyIndex = post.replies.findIndex(reply => reply._id === targetReplyId);

      if (replyIndex !== -1) {

        const targetPage = Math.floor(replyIndex / REPLIES_PER_PAGE) + 1;
        isNavigatingByHash.current = true;
        setCurrentReplyPage(targetPage);

        setTimeout(() => {
          const element = document.getElementById(targetReplyId);
          if (element) {

            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('reply-highlight');

            setTimeout(() => {
              element.classList.remove('reply-highlight');
            }, 2500);
          }
        }, 100); 
      }
    }
  }, [post, hash]); 

  const handlePostAction = async (action) => {
    if (!userId) {
      return navigate("/login", {
        state: { message: "You must be logged in to vote." },
      });
    }
    try {
      await axios.patch(`http://localhost:5000/api/forum/${postId}/${action}`, {
        userId,
      });
      fetchPost();
    } catch (error) {
      console.error(`Error ${action}ing post:`, error);
    }
  };

  const handleReplyAction = async (replyId, action) => {
    if (!userId) {
      return navigate("/login", {
        state: { message: "You must be logged in to vote." },
      });
    }
    try {
      await axios.patch(
        `http://localhost:5000/api/forum/${postId}/replies/${replyId}/${action}`,
        { userId }
      );
      fetchPost();
    } catch (error) {
      console.error(`Error ${action}ing reply:`, error);
    }
  };

  useEffect(() => {
    if (isInitialMount.current || isNavigatingByHash.current) {
      isInitialMount.current = false;
      isNavigatingByHash.current = false;
    } else {
      repliesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentReplyPage]);

  if (!post) return <p>Loading...</p>;

  const totalReplyPages = Math.ceil(post.replies.length / REPLIES_PER_PAGE);
  const replyStartIndex = (currentReplyPage - 1) * REPLIES_PER_PAGE;
  const replyEndIndex = currentReplyPage * REPLIES_PER_PAGE;
  const displayedReplies = post.replies.slice(replyStartIndex, replyEndIndex);

  return (
    <Container className="mt-4">
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Card.Subtitle className="text-muted mb-2">
            By{" "}
            {post.author
              ? `${post.author.name} (${post.author.roles})`
              : "Anonymous"}{" "}
            • {new Date(post.createdAt).toLocaleString()}
          </Card.Subtitle>
          <Card.Text className="my-3">{post.content}</Card.Text>

          <div>
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => handlePostAction("like")}
              className="me-2"
            >
              Like ({post.likes.length})
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handlePostAction("dislike")}
            >
              Dislike ({post.dislikes.length})
            </Button>
          </div>
        </Card.Body>
      </Card>

      <h5>Replies</h5>
      <ListGroup className="mb-3">
        {displayedReplies && displayedReplies.length > 0 ? (
          displayedReplies.map((reply) => (
            <ListGroup.Item
              key={reply._id}
              id={reply._id}
              className="d-flex justify-content-between align-items-start"
            >
              <div>
                <strong>
                  {reply.author
                    ? `${reply.author.name} (${reply.author.roles})`
                    : "User"}
                  :
                </strong>{" "}
                {reply.text}
                <br />
                <small className="text-muted">
                  {new Date(reply.createdAt).toLocaleString()}
                </small>
              </div>
              <div className="ms-3">
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => handleReplyAction(reply._id, "like")}
                  className="me-2"
                >
                  Like ({reply.likes.length})
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleReplyAction(reply._id, "dislike")}
                >
                  Dislike ({reply.dislikes.length})
                </Button>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No replies yet.</ListGroup.Item>
        )}
      </ListGroup>

      {totalReplyPages > 1 && (
        <div className="d-flex justify-content-center align-items-center my-3">
          <Button
            size="sm"
            onClick={() => setCurrentReplyPage(currentReplyPage - 1)}
            disabled={currentReplyPage === 1}
          >
            Previous
          </Button>
          <span className="mx-3">
            Page {currentReplyPage} of {totalReplyPages}
          </span>
          <Button
            size="sm"
            onClick={() => setCurrentReplyPage(currentReplyPage + 1)}
            disabled={currentReplyPage === totalReplyPages}
          >
            Next
          </Button>
        </div>
      )}

      <ReplyBox postId={postId} onReplyAdded={fetchPost} />
    </Container>
  );
};

export default ForumDetail;
