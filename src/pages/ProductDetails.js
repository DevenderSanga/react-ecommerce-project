import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetails.css";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    // ==============================
    // GET PRODUCT
    // ==============================

    useEffect(() => {
        getProduct();
    }, [id]);

    const getProduct = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5001/products/${id}`
            );

            const data = response.data;

            setProduct(data);

            // First image
            if (data.images && data.images.length > 0) {
                setSelectedImage(data.images[0]);
            } else if (data.image) {
                setSelectedImage(data.image);
            }

            // First color
            if (data.colors && data.colors.length > 0) {
                setSelectedColor(data.colors[0].name);
            }

            // First size/variant
            if (data.variants && data.variants.length > 0) {
                setSelectedSize(data.variants[0].size);
            }

        } catch (error) {
            console.log("Error fetching product:", error);
        }
    };

    // ==============================
    // LOADING
    // ==============================

    if (!product) {
        return (
            <div className="loading">
                Loading...
            </div>
        );
    }

    // ==============================
    // PRODUCT IMAGES
    // ==============================

    const productImages =
        product.images && product.images.length > 0
            ? product.images
            : product.image
                ? [product.image]
                : [];


    const productColors =
        product.colors && product.colors.length > 0
            ? product.colors
            : [];

    // ==============================
    // PRODUCT VARIANTS
    // ==============================

    const productVariants =
        product.variants && product.variants.length > 0
            ? product.variants
            : [];

    // ==============================
    // SELECTED VARIANT
    // ==============================

    const selectedVariant = productVariants.find(
        (variant) => variant.size === selectedSize
    );

    // If variant has different price use variant price
    const currentPrice =
        selectedVariant?.price || product.price;


    const addToCart = async () => {
        try {

            // Check stock
            if (
                product.stockStatus &&
                product.stockStatus !== "In Stock"
            ) {
                alert("Product is currently out of stock.");
                return;
            }

            // Size required only if variants exist
            if (
                productVariants.length > 0 &&
                !selectedSize
            ) {
                alert("Please select a size / variant.");
                return;
            }

            // Color required only if colors exist
            if (
                productColors.length > 0 &&
                !selectedColor
            ) {
                alert("Please select a color.");
                return;
            }

            // Check existing cart item
            const response = await axios.get(
                `http://localhost:5001/cart?productId=${product.id}&size=${encodeURIComponent(
                    selectedSize || ""
                )}&color=${encodeURIComponent(
                    selectedColor || ""
                )}`
            );

            if (response.data.length > 0) {

                const cartItem = response.data[0];

                await axios.patch(
                    `http://localhost:5001/cart/${cartItem.id}`,
                    {
                        quantity: cartItem.quantity + 1
                    }
                );

            } else {

                // Store complete required product information
                await axios.post(
                    "http://localhost:5001/cart",
                    {
                        productId: product.id,

                        name: product.name,

                        slug: product.slug,

                        brand: product.brand,

                        category: product.category,

                        subCategory: product.subCategory,

                        images: product.images || [],

                        image:
                            product.images?.[0] ||
                            product.image ||
                            "",

                        price: currentPrice,

                        originalPrice:
                            product.originalPrice || currentPrice,

                        discountPercentage:
                            product.discountPercentage || 0,

                        rating: product.rating || 0,

                        shortDescription:
                            product.shortDescription || "",

                        quantity: 1,

                        size: selectedSize || "",

                        color: selectedColor || "",

                        stock: product.stock || 0,

                        seller: product.seller || null
                    }
                );
            }

            alert("Product added to cart!");

        } catch (error) {

            console.log(
                "Error adding product to cart:",
                error
            );

            alert("Unable to add product to cart.");
        }
    };

    // ==============================
    // ADD TO WISHLIST
    // ==============================

    const addToWishlist = async () => {

        try {

            // Check if already exists
            const response = await axios.get(
                `http://localhost:5001/wishlist?productId=${product.id}`
            );

            if (response.data.length > 0) {

                alert("Already in wishlist!");

                return;
            }

            // Add complete product information
            await axios.post(
                "http://localhost:5001/wishlist",
                {
                    productId: product.id,

                    name: product.name,

                    slug: product.slug,

                    brand: product.brand,

                    category: product.category,

                    subCategory: product.subCategory,

                    images: product.images || [],

                    image:
                        product.images?.[0] ||
                        product.image ||
                        "",

                    price: currentPrice,

                    originalPrice:
                        product.originalPrice || currentPrice,

                    discountPercentage:
                        product.discountPercentage || 0,

                    rating: product.rating || 0,

                    totalReviews:
                        product.totalReviews || 0,

                    shortDescription:
                        product.shortDescription || "",

                    description:
                        product.description || "",

                    stock: product.stock || 0,

                    stockStatus:
                        product.stockStatus || "",

                    colors:
                        product.colors || [],

                    variants:
                        product.variants || [],

                    seller:
                        product.seller || null,

                    selectedColor:
                        selectedColor || "",

                    selectedSize:
                        selectedSize || "",

                    addedAt: new Date().toISOString()
                }
            );

            alert("Added to wishlist!");

        } catch (error) {

            console.log(
                "Error adding product to wishlist:",
                error
            );

            alert("Unable to add product to wishlist.");
        }
    };

    const buyNow = async () => {

        try {

            // Check stock
            if (
                product.stockStatus &&
                product.stockStatus !== "In Stock"
            ) {
                alert("Product is currently out of stock.");
                return;
            }

            // Check size
            if (
                productVariants.length > 0 &&
                !selectedSize
            ) {
                alert("Please select a size / variant.");
                return;
            }

            // Check color
            if (
                productColors.length > 0 &&
                !selectedColor
            ) {
                alert("Please select a color.");
                return;
            }

            const buyNowProduct = {

                productId: product.id,

                name: product.name,

                slug: product.slug,

                brand: product.brand,

                category: product.category,

                subCategory: product.subCategory,

                images: product.images || [],

                image:
                    product.images?.[0] ||
                    product.image ||
                    "",

                price: currentPrice,

                originalPrice:
                    product.originalPrice || currentPrice,

                discountPercentage:
                    product.discountPercentage || 0,

                quantity: 1,

                size: selectedSize || "",

                color: selectedColor || "",

                shortDescription:
                    product.shortDescription || "",

                seller:
                    product.seller || null
            };

            console.log(
                "Buy Now Product:",
                buyNowProduct
            );

            localStorage.setItem(
                "buyNowProduct",
                JSON.stringify(buyNowProduct)
            );

            navigate("/checkout");

        } catch (error) {

            console.log(
                "Buy Now error:",
                error
            );
        }
    };


    return (

        <div className="container product-details-container">

            <div className="row">

                {/* =====================================
                    PRODUCT INFORMATION
                ===================================== */}

                <div className="col-lg-5 product-information">

                    <button
                        className="btn btn-outline-secondary mb-4"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>

                    {/* Product Name */}

                    <h1 className="product-title">
                        {product.name}
                    </h1>

                    {/* Brand */}

                    <p className="product-brand">
                        Brand:{" "}
                        <strong>
                            {product.brand}
                        </strong>
                    </p>

                    {/* Rating */}

                    <div className="rating">

                        ⭐ {product.rating || 0}

                        <span>
                            {" "}
                            ({product.totalReviews || 0} reviews)
                        </span>

                    </div>

                    {/* Price */}

                    <div className="price-section">

                        <h2 className="product-price">
                            ₹
                            {Number(
                                currentPrice
                            ).toLocaleString("en-IN")}
                        </h2>

                        {product.originalPrice && (
                            <span className="original-price">
                                ₹
                                {Number(
                                    product.originalPrice
                                ).toLocaleString("en-IN")}
                            </span>
                        )}

                        {product.discountPercentage > 0 && (
                            <span className="discount">
                                {product.discountPercentage}% OFF
                            </span>
                        )}

                    </div>

                    <hr />

                    {/* Short Description */}

                    {product.shortDescription && (

                        <div>

                            <h5>About this product</h5>

                            <p className="product-description">
                                {product.shortDescription}
                            </p>

                        </div>
                    )}

                    {/* Full Description */}

                    {product.description && (

                        <div>

                            <h5>Description</h5>

                            <p className="product-description">
                                {product.description}
                            </p>

                        </div>
                    )}

                    {/* Category */}

                    {product.category && (

                        <p>
                            <strong>
                                Category:
                            </strong>{" "}
                            {product.category}
                        </p>
                    )}

                    {/* Sub Category */}

                    {product.subCategory && (

                        <p>
                            <strong>
                                Sub Category:
                            </strong>{" "}
                            {product.subCategory}
                        </p>
                    )}

                    {/* Stock */}

                    <p className="stock">

                        <strong>
                            Availability:
                        </strong>{" "}

                        {product.stockStatus ||
                            "In Stock"}

                        {product.stock !== undefined &&
                            ` (${product.stock} available)`}

                    </p>



                    {productColors.length > 0 && (
                        <div className="mb-4">
                            <h5>Select Color</h5>

                            <div className="color-options">

                                {productColors.map((color, index) => {

                                    const colorName =
                                        typeof color === "string"
                                            ? color
                                            : color.name;

                                    const colorHex =
                                        typeof color === "string"
                                            ? color
                                            : color.hex;

                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            className={`color-button ${selectedColor === colorName
                                                    ? "selected-color"
                                                    : ""
                                                }`}
                                            onClick={() => {
                                                setSelectedColor(colorName);
                                            }}
                                        >
                                            <span
                                                className="color-circle"
                                                style={{
                                                    backgroundColor: colorHex
                                                }}
                                            />

                                            <span>
                                                {colorName}
                                            </span>
                                        </button>
                                    );
                                })}

                            </div>

                            {selectedColor && (
                                <p className="mt-2">
                                    Selected Color:{" "}
                                    <strong>{selectedColor}</strong>
                                </p>
                            )}
                        </div>
                    )}

                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-4">
                            <h5>Select Size</h5>

                            <div className="mt-2">
                                {product.variants.map((variant, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={
                                            selectedSize === variant.value
                                                ? "btn btn-dark me-2 mb-2"
                                                : "btn btn-outline-dark me-2 mb-2"
                                        }
                                        onClick={() => {
                                            setSelectedSize(variant.value);
                                        }}
                                    >
                                        {variant.value}
                                    </button>
                                ))}
                            </div>

                            {selectedSize && (
                                <p className="mt-2">
                                    Selected Size: <strong>{selectedSize}</strong>
                                </p>
                            )}
                        </div>
                    )}



                    {product.features &&
                        product.features.length > 0 && (

                            <div className="product-features">

                                <h5>
                                    Key Features
                                </h5>

                                <ul>

                                    {product.features.map(
                                        (feature, index) => (

                                            <li key={index}>
                                                {feature}
                                            </li>

                                        )
                                    )}

                                </ul>

                            </div>
                        )}

                    {/* =====================================
                        DELIVERY
                    ===================================== */}

                    {product.delivery && (

                        <div className="delivery-info">

                            <h5>
                                Delivery & Returns
                            </h5>

                            {product.delivery.freeDelivery && (
                                <p>
                                    🚚 Free Delivery
                                </p>
                            )}

                            {product.delivery.estimatedDelivery && (
                                <p>
                                    📦 Delivery in{" "}
                                    {
                                        product.delivery
                                            .estimatedDelivery
                                    }
                                </p>
                            )}

                            {product.delivery.cashOnDelivery && (
                                <p>
                                    💵 Cash on Delivery Available
                                </p>
                            )}

                            {product.delivery.returnAvailable && (
                                <p>
                                    ↩️ Easy Return within{" "}
                                    {
                                        product.delivery
                                            .returnPeriod
                                    }
                                </p>
                            )}

                        </div>
                    )}

                    {/* =====================================
                        BUTTONS
                    ===================================== */}

                    <div className="product-buttons">

                        <button
                            className="btn btn-warning"
                            onClick={addToCart}
                        >
                            Add to Cart
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={buyNow}
                        >
                             Buy Now
                        </button>

                        <button
                            className="btn btn-danger"
                            onClick={addToWishlist}
                        >
                            Wishlist
                        </button>

                    </div>

                </div>

                {/* =====================================
                    PRODUCT GALLERY
                ===================================== */}

                <div className="col-lg-7 product-gallery">

                    {/* Main Image */}

                    <div className="main-image-box">

                        {selectedImage ? (

                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="main-product-image"
                            />

                        ) : (

                            <div className="no-image">
                                No Image Available
                            </div>

                        )}

                    </div>

                    {/* Thumbnails */}

                    <div className="thumbnail-container">

                        {productImages.map(
                            (image, index) => (

                                <div
                                    className={`thumbnail ${selectedImage === image
                                        ? "active-thumbnail"
                                        : ""
                                        }`}
                                    key={index}
                                    onClick={() =>
                                        setSelectedImage(
                                            image
                                        )
                                    }
                                >

                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                    />

                                </div>

                            )
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProductDetails;