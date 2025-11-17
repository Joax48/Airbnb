import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";
import "../../style/ResourceListPage.css";

const ResourceListPage = () => {
  const [params] = useSearchParams();

  const category = params.get("category");

  const path = window.location.pathname;
  const type =
    path.includes("properties")
      ? "properties"
      : path.includes("activities")
      ? "activities"
      : "services";

  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const endpoint =
          type === "properties"
            ? "/api/properties"
            : type === "activities"
            ? "/api/activities"
            : "/api/services";

        const res = await axios.get(`http://localhost:4000${endpoint}`);

        const filtered = res.data.filter((item) => {
          const itemType = (item.type || item.category || "").toLowerCase();
          return itemType === (category || "").toLowerCase();
        });

        setItems(filtered);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, [type, category]);

  const formatPrice = (n) => "₡" + Number(n).toLocaleString("es-CR");

  return (
    <>
      <Navbar />
      <Container>
        <h1 style={{ marginTop: "40px", marginBottom: "20px", fontSize: "32px", fontWeight: "700" }}>
          Resultados en <strong>{category}</strong>
        </h1>

        {items.length === 0 ? (
          <p>No hay elementos en esta categoría.</p>
        ) : (
            <div className="results-grid">
              {items.map((p) => {
                const id = p.id_property || p.id_activity || p.id_service;

                return (
                  <Link key={id} className="resource-card" to={`/${type}/${id}`}>

                    <div className="resource-img-wrapper">
                      <img
                        src={p.image_url || "/house-placeholder.jpg"}
                        alt={p.name}
                      />
                    </div>

                    <div className="resource-info">
                      <h3>{p.name}</h3>

                      <p className="resource-type">
                        {p.location || p.category || p.type}
                      </p>

                      {p.price && (
                        <p className="resource-price">
                        {formatPrice(p.price)}{" "}
                        <span>
                          {type==="properties" && "por noche"}
                          {type==="activities" && "por persona"}
                          {type==="services" && "por servicio"}
                        </span>
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

        )}
      </Container>
    </>
  );
};

export default ResourceListPage;
