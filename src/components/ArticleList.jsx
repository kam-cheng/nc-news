import { useState, useEffect } from "react";
import { fetchArticles } from "../utils/api";
import ArticleCard from "./ArticleCard.jsx";
import IncrementButton from "./IncrementButton";
import { useParams } from "react-router-dom";
import "./ArticleList.css";
import SortedBy from "./SortedBy";
import Order from "./Order";
import handleErrorMessage from "../utils/handle-error-message";
import ErrorComponent from "./ErrorComponent";
import Typography from "@mui/material/Typography";

export default function ArticleList() {
  const { topic } = useParams();
  const [articleList, setArticleList] = useState([]);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [hideIncButton, sethideIncButton] = useState(false);
  const [sortBy, setSortBy] = useState({
    name: "date",
    apiValue: "created_at",
  });
  const [order, setOrder] = useState({
    name: "descending",
    apiValue: "desc",
  });
  const [error, setError] = useState(null);

  //increase number of articles shown when button clicked
  const loadArticles = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const articles = await fetchArticles(
        limit,
        topic,
        sortBy.apiValue,
        order.apiValue
      );
      setArticleList(articles);
      setIsLoading(false);
      if (limit > articles.length) sethideIncButton(true);
    } catch (err) {
      setIsLoading(false);
      const customMessage =
        "loading articles failed - please reload page and try again";
      setError(handleErrorMessage(err, customMessage));
    }
  };

  // articles will re-render each time limit,topic,sortby or order changes
  useEffect(() => {
    loadArticles();
  }, [limit, topic, sortBy, order]);
  let loading = "";
  if (isLoading)
    loading = (
      <Typography variant="h4" gutterBottom>
        Loading Articles...
      </Typography>
    );

  if (error)
    return (
      <h1 className="error-message">
        <ErrorComponent error={error} />
      </h1>
    );
  return (
    <>
      <section className="article-list">
        <div className="selectors">
          <SortedBy sortBy={sortBy} setSortBy={setSortBy} />
          <Order order={order} setOrder={setOrder} />
        </div>
        <Typography variant="h4" gutterBottom>
          {topic || `Article List`}
        </Typography>
        {loading}
        <ul>
          {articleList.map((article) => {
            return <ArticleCard article={article} key={article.article_id} />;
          })}
        </ul>
        <IncrementButton
          setLimit={setLimit}
          name={`Articles`}
          isLoading={isLoading}
          hideIncButton={hideIncButton}
        />
      </section>
    </>
  );
}
