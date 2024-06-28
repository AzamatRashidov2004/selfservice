import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import New from './pages/new';
import Navbar from './components/navbar/navbar';
import './App.css'
import Dashboard from './pages/dashboard';


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<New />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
