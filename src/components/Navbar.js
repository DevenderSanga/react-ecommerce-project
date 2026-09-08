import React from "react";

import { Link } from "react-router-dom";


const Navbar = () => {

    return (

        <nav className="navbar navbar-dark bg-dark sticky-top">

            <div className="container">

                <Link
                    to="/"
                    className="navbar-brand"
                >
                    Devender 
                </Link>


                <div>

                    <Link
                        to="/"
                        className="btn btn-dark"
                    >
                        Home
                    </Link>


                    <Link
                        to="/products"
                        className="btn btn-dark"
                    >
                        Products
                    </Link>


                    <Link
                        to="/wishlist"
                        className="btn btn-dark"
                    >
                      Wishlist
                    </Link>


                    <Link
                        to="/cart"
                        className="btn btn-warning"
                    >
                        Cart
                    </Link>


                    <Link
                        to="/orders"
                        className="btn btn-dark"
                    >
                        Orders
                    </Link>

                </div>

            </div>

        </nav>

    );
};

export default Navbar;