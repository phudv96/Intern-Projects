# Book Management App

The Book Management App is a web application that allows users to manage their book collection. It provides features for adding, deleting, editing, and bookmarking books, as well as searching for books by title, author, or tags.

## Features

- **Add, Delete, Edit Books**: Only the admin account can perform CRUD operations on books.
- **Bookmark Books**: Both admin and guest accounts can bookmark books. Bookmarked books are unique to each account.
- **Search Books**: Users can search for books by title, author, or tags.
- **View Books Individually**: User can click on the book to view more information.
- **Leave Review**: User can leave review on books, and then they can sort by highest review to lowest.
- **Leave Comment**: User can leave comments on books. Guests can control and delete their own comments, while admin can delete any comments.
- **Login Using Google Account**: User can sign up and login using google account, will be defaulted to guest account.
- **Role-based Access Control**: The app has two user roles: admin and guest.

## Usage

1. Start the server:
cd Intern-Projects\MERNApp\backend
npm start

The server will run on http://127.0.0.1:8000.

2. Start the client:
cd Intern-Projects\MERNApp\frontend\book-management
npm run dev

The client will run on http://localhost:5173.

3. Access the app in your web browser:
http://localhost:5173/home

## Roles and Permissions

- **Admin Account**:
- Can perform all CRUD operations on books.
- Can bookmark books.
- Can search for books by categories.
- Can leave comment and delete any comments.
- Can score the book.

- **Guest Account**:
- Can only bookmark books.
- Can search for books by categories.
- Can leave comment, but only delete their own comment.
- Can score the book.