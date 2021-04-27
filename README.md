# General-Store
This is a general purpose CRUD web application for order processing, billing and inventory management. Built using MongoDB, Express, Vue, NodeJS (MEVN Stack).

### Complete tech stack
* NodeJS and Express REST API
* Cloud hosted MongoDB database
* Vue library along with Vuetify UI
* Single Page Application using vue-router and axios

[Demo](https://my-general-store-1708.herokuapp.com)

**NOTE**: Demo is hosted on free tier of Heroku which sleeps after 30 mins of inactivity. Please give it a moment to wake up.

### Features
* Get all products in inventory
* Create/Update/Delete products in inventory
* Create order with relational hierarchy with products
* Get all orders created till date

### Usage
> Step 1: Run the following commands in your terminal:

    git clone https://github.com/sandeep-menon/General-Store.git
    cd General-Store

> Step 2: In the file /server/config/keys.js replace "YOUR_MONGODB_URI" with one provided by MongoDB atlas.

> Step 3: Open two terminal windows simultaneously in one of them execute the following commands:

    cd server
    npm install
    npm run dev
    
> Step 4: Open the other terminal and run the following commands:

    cd client
    npm install 
    npm run serve
    
> Step 5: Open [http://localhost:8080](http://localhost:8080) in your browser.
