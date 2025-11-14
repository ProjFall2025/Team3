import './App.css';
import { DummyComponent } from './components/dummy.tsx';
import { Tester } from './components/Tester.tsx'; 

// React Router
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Sample components for routes
function Home() {
  return <h2>Home Page</h2>;
}

function About() {
  return <h2>About Page</h2>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<DummyComponent />} />
        <Route path="/audiotest" element={<Tester />}/>
      </Routes>
    </Router>
  );
}

export default App;
