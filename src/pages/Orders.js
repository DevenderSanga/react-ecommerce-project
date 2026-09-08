import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Orders.css";

const Orders = () => {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const getOrders = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:5001/orders"
                );

                setOrders(response.data);

            } catch (error) {

                console.log("Error fetching orders:", error);

            }

        };

        getOrders();

    }, []);

    const deleteOrder = async (id) => {

        try {

            await axios.delete(
                `http://localhost:5001/orders/${id}`
            );

            setOrders(
                orders.filter(
                    (order) => order.id !== id
                )
            );

        } catch (error) {

            console.log("Error deleting order:", error);

        }

    };


    return (

        <div className="orders-page">

            <div className="orders-header">

                <div>

                    <h1>
                        My Orders 📦
                    </h1>

                    <p>
                        Track and manage your orders
                    </p>

                </div>


                <div className="order-count">

                    {orders.length}

                    <span>
                        Orders
                    </span>

                </div>

            </div>

            {orders.length === 0 ? (

                <div className="empty-orders">

                    <div className="empty-icon">
                        📦
                    </div>

                    <h2>
                        No Orders Yet
                    </h2>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <button
                        onClick={() =>
                            window.location.href = "/products"
                        }
                    >
                        Start Shopping
                    </button>

                </div>

            ) : (


                /* Orders */

                <div className="orders-container">

                    {orders.map((order) => (

                        <div
                            className="order-card"
                            key={order.id}
                        >

                            <div className="order-top">

                                <div>

                                    <span className="order-label">
                                        ORDER ID
                                    </span>

                                    <h3>
                                        #{order.id}
                                    </h3>

                                </div>
                                <div className="order-status">

                                    <span className="status-dot"></span>

                                    {order.status || "Processing"}

                                </div>

                            </div>

                            <div className="customer-section">

                                <div className="customer-item">

                                    <span>
                                        👤
                                    </span>

                                    <div>

                                        <small>
                                            Customer
                                        </small>

                                        <strong>
                                            {order.customerName}
                                        </strong>

                                    </div>

                                </div>


                                <div className="customer-item">

                                    <span>
                                        📞
                                    </span>

                                    <div>

                                        <small>
                                            Phone
                                        </small>

                                        <strong>
                                            {order.phone}
                                        </strong>

                                    </div>

                                </div>


                                <div className="customer-item">

                                    <span>
                                        📅
                                    </span>

                                    <div>

                                        <small>
                                            Order Date
                                        </small>

                                        <strong>
                                            {order.date}
                                        </strong>

                                    </div>

                                </div>


                                <div className="customer-item">

                                    <span>
                                        📍
                                    </span>

                                    <div>

                                        <small>
                                            Delivery Address
                                        </small>

                                        <strong>
                                            {order.address}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                            <div className="products-section">

                                <h4>
                                    Ordered Products
                                </h4>


                                {order.items &&
                                    order.items.map(
                                        (item, index) => (

                                            <div
                                                className="order-product"
                                                key={item.id || index}
                                            >


                                                <div className="product-image">

                                                    {item.image ? (

                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                        />

                                                    ) : (

                                                        <span>
                                                            🛍️
                                                        </span>

                                                    )}

                                                </div>

                                                <div className="product-details">

                                                    <h3>
                                                        {item.title}
                                                    </h3>


                                                    <div className="product-info">

                                                        <span>
                                                            Qty:{" "}
                                                            <strong>
                                                                {item.quantity}
                                                            </strong>
                                                        </span>
                                                        {item.size && (

                                                            <span>
                                                                Size:{" "}
                                                                <strong>
                                                                    {item.size}
                                                                </strong>
                                                            </span>

                                                        )}


                                                        {item.color && (

                                                            <span>
                                                                Color:{" "}
                                                                <strong>
                                                                    {item.color}
                                                                </strong>
                                                            </span>

                                                        )}

                                                    </div>

                                                </div>


                                                <div className="product-price">

                                                    ₹
                                                    {item.price
                                                        ? (
                                                            item.price *
                                                            item.quantity
                                                        ).toLocaleString()
                                                        : "0"}

                                                </div>

                                            </div>

                                        )
                                    )}

                            </div>
                            
                            <div className="order-bottom">


                                <div className="total-section">

                                    <span>
                                        Order Total
                                    </span>

                                    <h2>

                                        ₹
                                        {order.total
                                            ? order.total.toLocaleString()
                                            : "0"}

                                    </h2>

                                </div>


                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        deleteOrder(order.id)
                                    }
                                >

                                    🗑️ Delete Order

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

};

export default Orders;