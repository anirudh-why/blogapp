import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosWithToken } from "../axiosWithToken";

function AddArticle() {
    const { register, handleSubmit } = useForm();
    let [err, setErr] = useState("");
    let { currentUser } = useSelector(
        (state) => state.userAuthorLoginReducer
    );
    let navigate=useNavigate();

    async function handleFormSubmit(article) {
        article.dateOfCreation = new Date();
        article.dateOfModification = new Date();
        article.articleId = Date.now();
        article.username = currentUser.username;
        article.comments = [];
        article.status = true;
        console.log(article);
        // You can perform additional actions here, such as sending the form data to a server
        //http post
        let res=await axiosWithToken.post('http://localhost:4000/author-api/articles',article)
        if(res.data.message==='New article created')
        {
            navigate(`/author-profile/articles-by-author/${currentUser.username}`)
        }
        else{
            setErr(res.data.message)
        }
    }

    return (
        <div>
            <div className='container'>
                <div className="card w-50 mx-auto mt-5 container">
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        {/* Article Title */}
                        <div className="mt-3">
                            <label htmlFor="articleTitle" className="form-label">
                                Article Title
                            </label>
                            <input
                                type="text"
                                id="articleTitle"
                                className="form-control"
                                {...register("title")}
                            />
                        </div>
                        {/* Category Dropdown */}
                        <div className="mt-3">
                            <label htmlFor="category" className="form-label">
                                Category
                            </label>
                            <select
                                id="category"
                                className="form-control"
                                {...register("category")}
                            >
                                <option value="">Select Category</option>
                                <option value="Mountains">Mountains</option>
                                <option value="Beach">Beach</option>
                                <option value="Adventure">Adventure</option>
                                <option value="Sports">Sports</option>
                                <option value="Buisness">Buisness</option>
                                <option value="Wildlife">Wildlife</option>
                            </select>
                        </div>
                        {/* Description */}
                        <div className="mt-3">
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="form-control"
                                {...register("description")}
                            />
                        </div>
                        <button type="submit" className="btn btn-success mt-3 mb-3">Publish Article</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddArticle;
