import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import New from './pages/New_Project';
import Navbar from './components/navbar/Navbar';
import './App.css'
import Dashboard from './pages/Dashboard';
import Landing_Page from './pages/Landing_Page';
import Try_Now from './pages/Try_Now';


function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing_Page />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-project" element={<New />} />
          <Route path="/try-now" element={<Try_Now />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
