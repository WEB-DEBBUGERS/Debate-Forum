import './News.css'
import { Link } from 'react-router-dom';

function NewsCard({ title, summary, imageUrl }) {
    return (
      <div className="news-card">
        <img
          src={imageUrl}
          alt={title}
        />
        <h1>{title}</h1>
        <p>{summary}</p>
        <div className='log-in-option'>
            <p style={{fontWeight: 700}}>Discuss With Our Community</p>
        <Link to="/login">
        <button className='login-button'>Login</button>
        </Link>
        </div>
      </div>
    );
  }
  
  export default NewsCard;
  