import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";

const Navbar = () => {

    const [cartCount, setCartCount] = useState(0);

    // Get cart count
    const getCartCount = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5001/cart"
            );

            const totalItems = response.data.reduce(
                (total, item) => {
                    return total + Number(item.quantity || 1);
                },
                0
            );

            setCartCount(totalItems);

        } catch (error) {

            console.error("Error fetching cart:", error);

        }
    };


    useEffect(() => {

        // Get count when Navbar loads
        getCartCount();

        // Listen for cart changes
        const handleCartUpdate = () => {
            getCartCount();
        };

        window.addEventListener(
            "cartUpdated",
            handleCartUpdate
        );

        // Cleanup
        return () => {
            window.removeEventListener(
                "cartUpdated",
                handleCartUpdate
            );
        };

    }, []);


    return (

        <nav className="navbar">

            <div className="navbar-brand">

                <Link to="/">
                    Devender
                </Link>

            </div>


            <div className="navbar-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/products">
                    Products
                </Link>

                <Link to="/wishlist">
                    Wishlist
                </Link>


                {/* CART */}

                <Link
                    to="/cart"
                    className="cart-link"
                >

                    <span className="cart-icon">
                        🛒
                    </span>

                    {cartCount > 0 && (
                        <span className="cart-count">
                            {cartCount}
                        </span>
                    )}

                </Link>


                <Link to="/orders"
                className="orders-link"
                >
                    Orders
                </Link>

            </div>

        </nav>

    );
};

export default Navbar;