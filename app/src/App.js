import './App.css';
import { DummyComponent } from './components/dummy.tsx';
import Home from './pages/home.tsx';
import Login from './pages/login.tsx';

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
      <div className="nav-links" style={{ display: 'flex', gap: '50px', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', fontSize: '1.5rem', backgroundColor: 'black', padding: '10px 0', color: 'white' }}>
        <div className={"logo"} style={{ fontFamily: '"Notable", sans-serif', fontSize: '2rem', paddingBottom: '8px' }}>KNOWTES</div>
        <div><a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</a></div>
        <div><a href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About</a></div>
        <div><a href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</a></div>
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
