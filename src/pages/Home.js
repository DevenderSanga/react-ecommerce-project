
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
    const categories = [
        {
            name: "Men's Fashion",
            icon: "👔",
            category: "Men"
        },
        {
            name: "Women's Fashion",
            icon: "👗",
            category: "Women"
        },
        {
            name: "Electronics",
            icon: "💻",
            category: "Electronics"
        },
        {
            name: "Shoes",
            icon: "👟",
            category: "Shoes"
        }
    ];

    return (
        <div className="home">

            <div className="home-header">
                <h1>Shop by Category</h1>
                <p>
                    Explore our collections and find
                    everything you need
                </p>
            </div>

            <div className="category-container">

                {categories.map((item) => (
                    <Link
                        to={`/products?category=${(item.category)}`}
                        className="category-card"
                        key={item.name}
                    >
                        <div className="category-icon">
                            {item.icon}
                        </div>

                        <h2>{item.name}</h2>

                        <span>Explore Now →</span>
                    </Link>
                ))}

            </div>

        </div>
    );
};

export default Home;
