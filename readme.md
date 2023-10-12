<h2> Documentation of Backend for Writers' base marketplace project </h2>

This is the backend repository for Writers' base frontend repo: <a href="https://github.com/Kern000/proj3-frontend"> Here </a> <br />
Live webpage of frontend is found: <a href="https://singular-jalebi-389fbc.netlify.app/#/"> Here </a> <br />

<h4> Entity Relational Diagram </h4>
<img src="./erd.png />

<h4> Database Details </h4>
Relational Database was constructed using Bookshelf model with knex queries using mySql2, and later transitioned into Postgres. Relational Database presents a quick way to update multiple related tables in a single transaction.

<h5> Database Relationships: </h5>
One to Many Relationship <br />
<ul> 
 <li> Product to category </li>
</ul>
Many to Many Relationship <br />
<ul> 
 <li> Product to genres </li>
</ul>

<h4> Restful API endpoints showcase for frontend user </h4>

<h5> Landing Route displaying products </h5>
GET Route <br />
https://singular-jalebi-389fbc.netlify.app/#/

<h5> User login </h5>
POST Route <br />
https://singular-jalebi-389fbc.netlify.app/#/users/login

<h5> User Registration </h5>
POST Route <br />
https://singular-jalebi-389fbc.netlify.app/#/users/register

<h4> All routes below have authentication and authorization required </h4>
<h5> User add product </h5>
POST Route <br />
https://singular-jalebi-389fbc.netlify.app/#/users/add-product/:userId

<h5> User fetching his uploaded products </h5>
GET Route <br />
https://singular-jalebi-389fbc.netlify.app/#/users/:productId/products

<h5> Cart </h5>
<h5> User fetch cart </h5>
GET Route <br />
https://singular-jalebi-389fbc.netlify.app/#/cart

<h5> User add item to cart </h5>
POST Route <br />
https://singular-jalebi-389fbc.netlify.app/#/cart/:product_id/add

<h5> User update cart item quantity </h5>
POST Route <br />
https://singular-jalebi-389fbc.netlify.app/#/cart/update-qty

<h5> Checkout </h5>
POST Route <br />
https://singular-jalebi-389fbc.netlify.app/#/checkout

<h5> Stripe Webhook route </h5>
This route allows our site to receive confirmation of user payment<br />
POST Route <br />
https://singular-jalebi-389fbc.netlify.app/#/checkout/process-payment

<h5> User fetch his/her paid orders </h5>
GET Route <br />
https://singular-jalebi-389fbc.netlify.app/#/orders

<h4> Non-Restful API endpoints showcase for Admin user </h4>
<h5> Admin Login </h5>
POST Route <br />
https://writers-base-backend.onrender.com/admin/login

<h5> Admin fetch or search products from users and admin </h5>
GET Route <br />
https://writers-base-backend.onrender.com/admin/products

<h5> Admin update products </h5>
POST Route <br />
https://writers-base-backend.onrender.com/admin/products/:productId/update

<h5> Admin deleting a cart </h5>
POST Route <br />
https://writers-base-backend.onrender.com/admin/carts/:cartId/delete-cart

<h5> Admin updating an order </h5>
POST Route <br />
https://writers-base-backend.onrender.com/admin/orders/update-quantity

<h4> Testing </h4>
Testing is conducted on development frontend routes and localhost routes.

<h4> Deployment </h4>
Backend deployment is on render. Backend admin pages are also hosted on render.


