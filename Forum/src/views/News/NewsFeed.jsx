import NewsCard from "./NewsCard";
import { NEWS_URL } from "../../config/api-config";
import { useState, useEffect } from "react";
import './News.css'

function NewsFeed() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(NEWS_URL)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setNews(data.articles);
        } else {
          setNews([]);
        }
      })
      .catch((err) => console.error(err.message));
  },[]);

  return (
    
      <div className='news-box'>
        {news.slice(0,10).map((item, i) => (
          <NewsCard
            key={i}
            title={item.title}
            summary={item.description}
            imageUrl={item.urlToImage}
          />
        ))}
      </div>
  
  );
}

export default NewsFeed;