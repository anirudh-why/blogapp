import './App.css';
import {RouterProvider,Navigate,createBrowserRouter} from 'react-router-dom'
import RootLayout from './RootLayout';
import Error from './comp/Error'
import Signin from './comp/Signin';
import Home from './comp/Home';
import AuthorProfile from './comp/Authorprofile';
import UserProfile from './comp/UserProfile';
import AddArticle from './comp/AddArticle';
import ArticlesByAuthor from './comp/ArticlesByAuthor';
import Articles from './comp/Articles';
import Article1 from './comp/Article1';
import Signup1 from './comp/Signup1'

function App() {

  let router=createBrowserRouter([
    {
      path:"",
      element:<RootLayout />,
      errorElement:<Error />,
      children:[
        {
          path:"",
          element:<Home />
        },
        {
          path:"/home",
          element:<Home />
        },
        {
          path:"/signin",
          element:<Signin />
        },
        {
          path:"/signup",
          element:<Signup1 />
        },
        {
          path:"/user-profile",
          element:<UserProfile />,
          children:[
            {
              path:"articles",
              element:<Articles />
            },
            {
              path:"article/:articleId",
              element:<Article1 />
            },
            {
              path:"",
              element:<Navigate to='articles' />
            }
          ]
        },
        {
          path:"/author-profile",
          element:<AuthorProfile />,
          children:[
            {
              path:"new-article",
              element:<AddArticle />
            },
            {
              path:"article/:articleId",
              element:<Article1 />
            },
            {
              path:"articles-by-author/:username",
              element:<ArticlesByAuthor />
            },
            {
              path:"",
              element:<Navigate to='articles-by-author/:username' />
            }
          ]
        }
      ]
    }
  ])  

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
