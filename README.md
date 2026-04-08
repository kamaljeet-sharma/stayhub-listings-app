#StayHub Listings App#

#A full-stack web application built using the MERN stack (MongoDB, Express, Node.js) with EJS templating, where users can view, create, edit, and manage property listings.

. Features
. View all listings
. Add new listings
. Edit existing listings
. Delete listings
. MongoDB database integration
. Error handling with custom middleware
. EJS templates with dynamic rendering
.
Tech Stack
Frontend: EJS, HTML, CSS
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Other Tools:
method-override
ejs-mate (for layouts)
📁 Project Structure
stayhub-listings-app/
│── models/
│   └── listing.js
│
│── Utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
│── init/
│   ├── data.js
│   └── index.js
│
│── views/
│── public/
│── app.js
│── package.json
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/stayhub-listings-app.git
cd stayhub-listings-app
2️⃣ Install dependencies
npm install
3️⃣ Start MongoDB

Make sure MongoDB is running locally:

mongodb://127.0.0.1:27017/Wonderlust
4️⃣ Run the application
node app.js
5️⃣ Open in browser
http://localhost:8080
📌 Routes Overview
Route	Description
/	Home route
/listings	Show all listings
/listings/new	Create new listing
/listings/:id	Show single listing
/listings/:id/edit	Edit listing
🧠 Learning Highlights
RESTful routing
MVC structure
Async error handling
MongoDB schema design
Server-side rendering with EJS

* Author : Kamaljeet Sharma

. Future Improvements
. Authentication (Login/Register)
. Reviews & Ratings
. Image upload (Cloudinary)
. Map integration
