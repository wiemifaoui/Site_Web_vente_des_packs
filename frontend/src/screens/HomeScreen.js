import { useEffect, useState } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pack from "../components/Pack";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import "./SigninScreen.css";

// import data from '../data';

function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [packs, setPacks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("/api/packs");
        setPacks(result.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>Dourbia</title>
      </Helmet>
      <h1>Featured Packs</h1>
      <div className="packs">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {packs.map((pack) => (
              <Col key={pack.slug} sm={6} md={4} lg={3} className="mb-3">
                <Pack pack={pack}></Pack>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;
