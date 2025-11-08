import React from 'react';
import { axiosWithToken } from '../axiosWithToken'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Articles.css'

function Articles() {
    const [articlesList, setArticlesList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    let navigate = useNavigate();

    async function getArticlesOfCurrentAuthor() {
        try {
            setLoading(true);
            setError(null);
            let res = await axiosWithToken.get(`/user-api/articles`);
            
            if (res.data && Array.isArray(res.data.payload)) {
                setArticlesList(res.data.payload);
            } else {
                setArticlesList([]);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch articles');
            setArticlesList([]);
        } finally {
            setLoading(false);
        }
    }
    
    const readArticleByArticleId = (articleObj) => {
        navigate(`../article/${articleObj.articleId}`, { state: articleObj });
    }
    
    useEffect(() => {
        getArticlesOfCurrentAuthor();
    }, []);

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    Error loading articles: {error}
                </div>
            </div>
        );
    }

    return (
        <div className='container'>
            {articlesList && articlesList.length > 0 ? (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5">
                    {articlesList.map((article) => (
                        <div className="col" key={article.articleId}>
                            <div className="card h-100 uull">
                                <div className="card-body">
                                    <h5 className="card-title" style={{ fontFamily: 'Arial, sans-serif' }}>{article.title}</h5>
                                    <p className="card-text">
                                        {article.description?.substring(0, 80) + "...."}
                                    </p>
                                    <button className="custom-btn btn-4 qwqw" onClick={() => readArticleByArticleId(article)}>
                                        <span>Read More</span>
                                    </button>
                                </div>
                                <div className="card-footer">
                                    <small className="text-body-secondary">
                                        Last updated on {new Date(article.dateOfModification).toLocaleDateString()}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="container mt-5">
                    <div className="alert alert-info" role="alert">
                        No articles found.
                    </div>
                </div>
            )}
        </div>
    );
}

export default Articles;