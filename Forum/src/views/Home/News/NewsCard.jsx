import './News.css'
import { Link } from 'react-router-dom';
import { Button, HStack } from "@chakra-ui/react";

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
        <HStack>
          <Button>Login</Button>
        </HStack>
        </Link>
        </div>
      </div>
    );
  }
  
  export default NewsCard;
  