import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import UniversityDashboard from './pages/UniversityDashboard.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import EmployerDashboard from './pages/EmployerDashboard.jsx';
import VerifyLinkPage from './pages/VerifyLinkPage.jsx';

export default function App() {
  return (
    <div>
      <nav className="nav">
        <h1>Degree Verify</h1>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/university">University</Link>
          <Link to="/student">Student</Link>
          <Link to="/employer">Employer</Link>
        </div>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/university" element={<UniversityDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/verify/:id" element={<VerifyLinkPage />} />
        </Routes>
      </main>
    </div>
  );
}
