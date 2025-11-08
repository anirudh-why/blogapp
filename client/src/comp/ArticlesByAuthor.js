import React, { useEffect, useState } from 'react';
import { axiosWithToken } from '../axiosWithToken';
import { useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import './Articles.css';

function ArticlesByAuthor() {
  
  const [articlesList, setArticlesList] = useState([]);
  let navigate=useNavigate();
  let { currentUser } = useSelector(
    (state) => state.userAuthorLoginReducer
  );

  async function getArticlesOfCurrentAuthor() {
    try {
      if (!currentUser?.username) return;
      const res = await axiosWithToken.get(`/author-api/articles/${currentUser.username}`);
      const payload = res.data?.payload;
      if (Array.isArray(payload)) {
        setArticlesList(payload);
      } else {
        setArticlesList([]);
      }
    } catch (err) {
      setArticlesList([]);
    }
  }

  const readArticleByArticleId=(articleObj)=>{
    navigate(`../article/${articleObj.articleId}`,{state:articleObj})
  }

  useEffect(()=>{
     getArticlesOfCurrentAuthor();
  },[])

  
  
  return (
    <div className='container'>
      {articlesList.length === 0 ? (
        <div className="alert alert-info mt-5" role="alert">
          No articles found for this author.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5">
          {articlesList.map((article) => (
            <div className="col" key={article.articleId}>
              <div className="card h-100 uull">
                <div className="card-body">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">
                    {(article.description || '').substring(0, 80) + (article.description ? '....' : '')}
                  </p>
                  <button className="custom-btn btn-4 qwqw" onClick={() => readArticleByArticleId(article)}>
                    <span>Read More</span>
                  </button>
                </div>
                <div className="card-footer">
                  <small className="text-body-secondary">
                    Last updated on {article.dateOfModification}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Outlet />
    </div>
  );
}

export default ArticlesByAuthor