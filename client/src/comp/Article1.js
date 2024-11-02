import { useLocation } from "react-router-dom";
import { useState } from "react";
import { axiosWithToken } from "../axiosWithToken";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FcClock, FcCalendar, FcComments, FcPortraitMode } from "react-icons/fc";
import { CiEdit } from "react-icons/ci";
import { MdDelete, MdRestore } from "react-icons/md";
import { BiCommentAdd } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import './Article.css';

function Article1() {
  const { state } = useLocation();
  const { currentUser } = useSelector((state) => state.userAuthorLoginReducer);
  const { register, handleSubmit } = useForm();
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const [articleEditStatus, setArticleEditStatus] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(state);

  const deleteArticle = async () => {
    const art = { ...currentArticle };
    delete art._id;
    const res = await axiosWithToken.put(
      `${window.location.origin}/author-api/articles/${currentArticle.articleId}`,
      art
    );
    if (res.data.message === 'article deleted') {
      setCurrentArticle({ ...currentArticle, status: res.data.payload });
    }
  };

  const restoreArticle = async () => {
    const art = { ...currentArticle };
    delete art._id;
    const res = await axiosWithToken.put(
      `${window.location.origin}/author-api/articles/${currentArticle.articleId}`,
      art
    );
    if (res.data.message === 'article restored') {
      setCurrentArticle({ ...currentArticle, status: res.data.payload });
    }
  };

  const writeComment = async (commentObj) => {
    commentObj.username = currentUser.username;
    const res = await axiosWithToken.post(
      `${window.location.origin}/user-api/comment/${state.articleId}`,
      commentObj
    );
    if (res.data.message === 'Comment posted') {
      setComment(res.data.message);
    }
  };

  const enableEditState = () => {
    setArticleEditStatus(true);
  };

  const saveModifiedArticle = async (editedArticle) => {
    const modifiedArticle = { ...state, ...editedArticle, dateOfModification: new Date() };
    delete modifiedArticle._id;
    const res = await axiosWithToken.put(
      `${window.location.origin}/author-api/articles`,
      modifiedArticle
    );
    if (res.data.message === 'Article Modified') {
      setArticleEditStatus(false);
      navigate(`/author-profile/article/${modifiedArticle.articleId}`, {
        state: res.data.article,
      });
    }
  };

  function ISOtoUTC(iso) {
    const date = new Date(iso).getUTCDate();
    const day = new Date(iso).getUTCDay();
    const year = new Date(iso).getUTCFullYear();
    return `${date}/${day}/${year}`;
  }

  return (
    <div className="container my-5 p-4 shadow-sm bg-white rounded article-container">
      {articleEditStatus === false ? (
        <>
          <div className="article-header">
            <h1 className="display-4">{state.title}</h1>
            <div className="article-info d-flex justify-content-between align-items-center mt-3">
              <div>
                <small className="text-muted me-4">
                  <FcCalendar /> Created on: {ISOtoUTC(state.dateOfCreation)}
                </small>
                <small className="text-muted">
                  <FcClock /> Modified on: {ISOtoUTC(state.dateOfModification)}
                </small>
              </div>
              {currentUser.usertype === 'author' && (
                <div className="action-buttons">
                  <button className="btn btn-warning me-2" onClick={enableEditState}>
                    <CiEdit /> Edit
                  </button>
                  {currentArticle.status ? (
                    <button className="btn btn-danger me-2" onClick={deleteArticle}>
                      <MdDelete /> Delete
                    </button>
                  ) : (
                    <button className="btn btn-info me-2" onClick={restoreArticle}>
                      <MdRestore /> Restore
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="article-content my-4">
            <p className="lead" style={{ whiteSpace: 'pre-line' }}>
              {state.description}
            </p>
          </div>

          <div className="comments-section">
            <h2 className="display-6 mb-4">Comments</h2>
            {state.comments.length === 0 ? (
              <p className="text-muted">No comments yet...</p>
            ) : (
              state.comments.map((commentObj, ind) => (
                <div key={ind} className="comment-box bg-light p-3 mb-3 rounded">
                  <p className="fw-bold text-primary">
                    <FcPortraitMode /> {commentObj.username}
                  </p>
                  <p className="text-secondary ms-3">
                    <FcComments /> {commentObj.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          {currentUser.usertype === 'user' && (
            <form onSubmit={handleSubmit(writeComment)} className="mt-4">
              <input
                type="text"
                {...register("comment")}
                className="form-control mb-3"
                placeholder="Write your comment here..."
              />
              <button type="submit" className="btn btn-success">
                Add a Comment <BiCommentAdd />
              </button>
            </form>
          )}
        </>
      ) : (
        <div className="edit-article-form">
          <form onSubmit={handleSubmit(saveModifiedArticle)} className="p-4 bg-light rounded">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                {...register("title")}
                defaultValue={state.title}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Select a category
              </label>
              <select
                {...register("category")}
                id="category"
                className="form-select"
                defaultValue={state.category}
              >
                <option value="Mountains">Mountains</option>
                <option value="Beach">Beach</option>
                <option value="Adventure">Adventure</option>
                <option value="Sports">Sports</option>
                <option value="Business">Business</option>
                <option value="Wildlife">Wildlife</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="content" className="form-label">
                Content
              </label>
              <textarea
                {...register("description")}
                className="form-control"
                id="content"
                rows="6"
                defaultValue={state.description}
              ></textarea>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-success">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Article1;
