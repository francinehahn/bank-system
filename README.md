<h1 align="center">LabeBank 🏦</h1>

##  ℹ️About
API REST developed with the objective of simulating a banking system with several functionalities and practicing Node.js, TypeScript, Express, Knex, MySQL, Authentication, and Criptography. CRUD (Create, Read, Update and Delete) requests were built respecting the semantics and organization necessary for the elaboration of an API with RESTful principles.

##  👩‍💻Developers
- <a href="https://github.com/francinehahn" target="_blank"><p>Francine Hahn</p></a>
- <a href="https://github.com/gioivieira" target="_blank"><p>Giovana Inez Vieira</p></a>
- <a href="https://github.com/mariafmf" target="_blank"><p>Maria Fernandez de Moura Ferro</p></a>

## 🔗Documentation
https://documenter.getpostman.com/view/22375317/2s8YsxvBt8

## ☑️Requests
- Get Account Balance
- Get User Statements
- Signup
- Login
- Make a Payment
- Add Balance
- Make a Bank Transfer
- Delete a Bank Account

## 💻Technologies
- Node.js
- TypeScript
- Express.js
- Knex
- MySQL

## 🛰Running the project
<pre>
  <code>git clone https://github.com/francinehahn/bank-system.git</code>
</pre>

<pre>
  <code>cd bank-system</code>
</pre>

<pre>
  <code>npm install</code>
</pre>

Create a file .env and complete the following variables:
<pre>
  <code>
    DB_HOST = ""
    DB_USER = ""
    DB_PASSWORD = ""
    DB_SCHEMA = ""

    PORT = 3000
    JWT_KEY = "labeBank"
  </code>
</pre>

To add the tables to your database, run the following command:
<pre>
  <code>npm run migrations</code>
</pre>

<pre>
  <code>npm run start</code>
</pre>

Finally, you can use Postman or any other similar tools to test the endpoints.
