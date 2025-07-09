# Fishinghub Setup Instructions

## Issue Resolution
The original package.json file had several issues:
1. Dependency versions were too high and incompatible (e.g., React 19.1.0 doesn't exist yet)
2. There was no "dev" script defined
3. There was no script to run the json-server for the mock API

These issues have been fixed in the updated package.json file.

## How to Run the Project

### Step 1: Install Dependencies
Run the following command to install all dependencies:
```
npm install
```

### Step 2: Start the Development Server
You can use either of these commands to start the React development server:
```
npm start
```
or
```
npm run dev
```
This will start the application on http://localhost:3000

### Step 3: Start the Mock API Server (in a separate terminal)
```
npm run server
```
This will start the json-server on http://localhost:3001

## Available API Endpoints
- Users: http://localhost:3001/users
- Categories: http://localhost:3001/categories
- Shop Items: http://localhost:3001/shop
- Shopping Cart: http://localhost:3001/shoppingCart
- Order Status: http://localhost:3001/orderStatus
- Orders: http://localhost:3001/orders
- Order Details: http://localhost:3001/orderDetails
- Fish Knowledge: http://localhost:3001/knowledgeFish

## Project Structure
This is a React application created with Create React App, with a json-server backend for development.