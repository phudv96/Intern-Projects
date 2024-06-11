import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import BookPage from './pages/Home/BookPage';

const routes = (
  <Router>
    <Routes>
      <Route path="/home" exact element={<Home/>} />
      <Route path="/login" exact element={<Login/>} />
      <Route path="/signup" exact element={<SignUp/>} />
      <Route path="/book/:title" exact element={<BookPage/>} />
    </Routes>
  </Router>
);

const App = () => {
  return (
    <div>
    {routes}
    </div>
  )
}

export default App
