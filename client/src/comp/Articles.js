import React from 'react';
import { axiosWithToken } from '../axiosWithToken'
import { useEffect, useState } from "react";
import { useNavigate ,Outlet} from "react-router-dom";
import './Articles.css'

function Articles() {

    const [articlesList, setArticlesList] = useState([]);
    let navigate=useNavigate();

    async function getArticlesOfCurrentAuthor(){
        let res=await axiosWithToken.get(`http://localhost:4000/user-api/articles`)
        console.log(res.data.payload);
        setArticlesList(res.data.payload);
    }
    
    const readArticleByArticleId=(articleObj)=>{
        navigate(`../article/${articleObj.articleId}`,{state:articleObj})
    }
    
    useEffect(()=>{
        getArticlesOfCurrentAuthor();
    },[])
    



  return (
    <div className='container'>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5">
        {articlesList.map((article) => (
          <div className="col" key={article.articleId}>
            <div className="card h-100 uull">
              <div className="card-body">
                <h5 className="card-title" style={{ fontFamily: 'Arial, sans-serif' }}>{article.title}</h5>
                <p className="card-text">
                  {article.description.substring(0, 80) + "...."}
                </p>
                <button className="custom-btn btn-4 qwqw" onClick={()=>readArticleByArticleId(article)}>
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
    </div>
  )
}

export default Articles