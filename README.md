# React E-commerce Website

A responsive e-commerce website built using React.js, JavaScript, CSS, Axios and JSON Server.

## Features

* Home page
* Product listing
* Product search
* Category filtering
* Brand filtering
* Product details
* Multiple product images
* Add to Cart
* Wishlist
* Checkout
* Order management
* Delete orders
* Responsive product cards
* Dynamic product details using ID
* JSON Server REST API

## Technologies Used

* React.js
* JavaScript
* HTML5
* CSS3
* Axios
* React Router
* JSON Server
* Vite

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/react-ecommerce-project.git
```

Go to the project folder:

```bash
cd react-ecommerce-project
```

Install dependencies:

```bash
npm install
```

## Run React Application

```bash
npm run dev
```

## Run JSON Server

Open another terminal and run:

```bash
npx json-server --watch db.json --port 5001
```

## API

Products:

```text
http://localhost:5001/products
```

Wishlist:

```text
http://localhost:5001/wishlist
```

Orders:

```text
http://localhost:5001/orders
```

## Project Structure

```text
src/
├── components/
├── pages/
├── styles/
├── App.jsx
└── main.jsx

db.json
package.json
```

## Future Improvements

* User authentication
* Payment integration
* Backend database
* Admin dashboard
* Product reviews
* Order tracking
* Deployment
