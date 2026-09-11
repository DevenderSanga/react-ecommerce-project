import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/Products.css";

const Products = () => {

    const [products, setProducts] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState("");
    const [brand, setBrand] = useState("All");
    const [loading, setLoading] = useState(true);

    const category = searchParams.get("category") || "All";

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                "http://localhost:5001/products"
            );

            setProducts(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const brands = [
        "All",
        ...new Set(
            products
                .map((product) => product.brand)
                .filter(Boolean)
        )
    ];

    const filteredProducts = products.filter((product) => {

        const categoryMatch =
            category === "All" ||
            product.category?.toLowerCase() ===
            category.toLowerCase();

        const brandMatch =
            brand === "All" ||
            product.brand === brand;

        const searchMatch =
            product.name
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            product.brand
                ?.toLowerCase()
                .includes(search.toLowerCase());

        return categoryMatch && brandMatch && searchMatch;
    });

    const changeCategory = (value) => {

        const params = new URLSearchParams(searchParams);

        if (value === "All") {
            params.delete("category");
        } else {
            params.set("category", value);
        }

        setSearchParams(params);
    };

    return (
        <div className="products-page">

            <h1>
                {category === "All"
                    ? "All Products"
                    : `${category} Products`}
            </h1>

            {/* Filters */}
            <div className="filters">

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />


                {/* Brand */}
                <select
                    value={brand}
                    onChange={(e) =>
                        setBrand(e.target.value)
                    }
                >
                    {brands.map((item) => (
                        <option
                            value={item}
                            key={item}
                        >
                            {item}
                        </option>
                    ))}
                </select>

            </div>

            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                    <p>Loading products...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="no-data">
                    No products found
                </div>
            ) : (
                <div className="products-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};

export default Products;