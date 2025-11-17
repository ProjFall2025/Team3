import './App.css';
import { DummyComponent } from './components/dummy.tsx';
import Home from './pages/home.tsx';
import Login from './pages/login.tsx';
import Register from './pages/register.tsx';
import Navbar from './components/navbar.tsx';
import { Tester } from './components/Tester.tsx'; 

// React Router
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// useEffect for development purposes
import { useEffect } from 'react';

// Sample components for routes

function About() {
  return <h2>About Page</h2>;
}

function App() {
  // FOR TAILWINDCSS DEVELOPMENT PURPOSES ONLY:
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
    document.head.appendChild(script);
    document.body.classList.add("bg-gray-100");
    console.log("App component mounted");
  }, []);
  // For use in production, rebuild tailwind.css using the command:
  //    npx tailwindcss -i ./src/tailwind.css -o ./src/tailwind.css

  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/audiotest" element={<Tester />}/>
      </Routes>
      </Router>
    </>
  );
}

export default App;
