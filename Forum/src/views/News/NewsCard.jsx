import './News.css'
import { Link } from 'react-router-dom';
import { Button, HStack } from "@chakra-ui/react";
import { useContext } from 'react';
import { AppContext } from '../../state/app.context';


function NewsCard({ title, summary, imageUrl }) {

  const {user} = useContext(AppContext)

    return (
      <div className="news-card" style={{border: '1px solid black'}}>
        <img
          src={imageUrl}
          alt={title}
        />
        <h1>{title}</h1>
        <p>{summary}</p>
        {!user ?
        <div className='log-in-option'>
            <p style={{fontWeight: 700}}>Discuss With Our Community</p>
        <Link to="/login">
        <HStack>
          <Button style={{ backgroundColor: '#929292' , padding: '15px'}}>Login</Button>
        </HStack>
        </Link>
        </div> :
        <div className='create-post-option'>
        <Link to='/create-post'>
          <Button style={{textDecoration: "underline"}}>Share Your Opinion Here</Button>
        </Link>
        </div>
        }
      </div>
    );
  }
  
  export default NewsCard;
  