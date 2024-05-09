import { useLocation } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { axiosWithToken } from "../axiosWithToken";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FcClock } from "react-icons/fc";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FcCalendar } from "react-icons/fc";
import { FcComments } from "react-icons/fc";
import { FcPortraitMode } from "react-icons/fc";
import { BiCommentAdd } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { MdRestore } from "react-icons/md";
import './Article.css'

function Article1() {
  const { state } = useLocation();
  let { currentUser } = useSelector(
    (state) => state.userAuthorLoginReducer
  );

  let { register, handleSubmit } = useForm();
  let [comment, setComment] = useState("");
  let navigate = useNavigate();
  let [articleEditStatus, setArticleEditStatus] = useState(false);
  let [currentArticle, setCurrentArticle] = useState(state);

  const deleteArticle = async() => {
    let art={...currentArticle};
    console.log(art);
    delete art._id;
    let res=await axiosWithToken.put(`http://localhost:4000/author-api/articles/${currentArticle.articleId}`,art)
    if(res.data.message==='article deleted'){
      setCurrentArticle({...currentArticle,status:res.data.payload})
    }
    console.log(art);
  };

  const restoreArticle =async () => {
    let art={...currentArticle};
    delete art._id;
    let res=await axiosWithToken.put(`http://localhost:4000/author-api/articles/${currentArticle.articleId}`,art)
    if(res.data.message==='article restored'){
      setCurrentArticle({...currentArticle,status:res.data.payload})
    }
  };

  //add comment top an article by user
  const writeComment = async (commentObj) => {
    commentObj.username = currentUser.username;
    console.log(commentObj)
    let res = await axiosWithToken.post(`http://localhost:4000/user-api/comment/${state.articleId}`,
      commentObj
    );
    if (res.data.message === "Comment posted") {
      setComment(res.data.message);
    }
  };

  //enable edit state
  const enableEditState = () => {
    setArticleEditStatus(true);
  };

  //disable edit state
  const saveModifiedArticle = async (editedArticle) => {
    //setArticleEditStatus(false);
    let modifiedArticle = { ...state, ...editedArticle };
    //change date of modification
    modifiedArticle.dateOfModification = new Date();
    //remove _id
    delete modifiedArticle._id;
    console.log(modifiedArticle)
    //make http put req to save modified article in db
    let res = await axiosWithToken.put("http://localhost:4000/author-api/articles",modifiedArticle);
    console.log(res);
    if (res.data.message === "Article Modified") {
      setArticleEditStatus(false);
      
      navigate(`/author-profile/article/${modifiedArticle.articleId}`, {state: res.data.article,});
    }
  };

  //convert ISO date to UTC data
  function ISOtoUTC(iso) {
    let date = new Date(iso).getUTCDate();
    let day = new Date(iso).getUTCDay();
    let year = new Date(iso).getUTCFullYear();
    return `${date}/${day}/${year}`;
  }

  return (
    <div className="container mt-5 mb-5">
      {articleEditStatus === false ? (
        <>
          <div className="bg-light">
          <div className="d-flex justify-content-between">
            <div>
              <p className="display-3 me-4">{state.title}</p>
              <span className="py-3">
                <small className=" text-secondary me-4">
                  <FcCalendar className="fs-4" />
                  Created on:{ISOtoUTC(state.dateOfCreation)}
                </small>
                <small className=" text-secondary">
                  <FcClock className="fs-4" />
                  Modified on: {ISOtoUTC(state.dateOfModification)}
                </small>
              </span>
            </div>
            <div>
              {currentUser.usertype === "author" && (
                <>
                 
                  <button
                    className="me-2 btn btn-warning "
                    onClick={enableEditState}
                  >
                    <CiEdit className="fs-2" />
                  </button>
                  {currentArticle.status === true ? (
                    <button
                      className="me-2 btn btn-danger"
                      onClick={deleteArticle}
                    >
                      <MdDelete className="fs-2" />
                    </button>
                  ) : (
                    <button
                      className="me-2 btn btn-info"
                      onClick={restoreArticle}
                    >
                      <MdRestore className="fs-2" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <p className="lead mt-3" style={{ whiteSpace: "pre-line" }}>
            {state.description}
          </p>
          {/* user comments */}
          <div className="container oopp">
            {/* read existing comments */}
            <div className="comments my-4 oopp">
              {state.comments.length === 0 ? (
                <p className="display-3">No comments yet...</p>
              ) : (
                state.comments.map((commentObj, ind) => {
                  return (
                    <div key={ind} className="bg-light  p-3">
                      <p
                        className="fs-4"
                        style={{
                          color: "dodgerblue",
                          textTransform: "capitalize",
                        }}
                      >
                        <FcPortraitMode className="fs-2 me-2" />
                        {commentObj.username}
                      </p>

                      <p
                        style={{
                          fontFamily: "fantasy",
                          color: "lightseagreen",
                        }}
                        className="ps-4"
                      >
                        <FcComments className="me-2" />
                        {commentObj.comment}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            <h1>{comment}</h1>
            {/* write comment by user */}
            {currentUser.usertype === "user" && (
              <form onSubmit={handleSubmit(writeComment)}>
                <input
                  type="text"
                  {...register("comment")}
                  className="form-control mb-4 "
                  placeholder="Write comment here...."
                />
                <button type="submit" className="btn btn-success">
                  Add a Comment <BiCommentAdd className="fs-3" />
                </button>
              </form>
            )}
          </div>
          </div>
        </>
      ) : (
        <div className="card w-50 mx-auto mt-5 container">
        <form onSubmit={handleSubmit(saveModifiedArticle)} className="container">
          <div className="mb-4">
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

          <div className="mb-4">
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
              <option value="Buisness">Buisness</option>
              <option value="Wildlife">Wildlife</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea
              {...register("description")}
              className="form-control"
              id="content"
              rows="10"
              defaultValue={state.description}
            ></textarea>
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-success">
              Save
            </button>
          </div>
        </form></div>
      )}
    </div>
  );
}

export default Article1;