import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import VacanciesPage from './pages/VacanciesPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// User Components
import Profile from './components/user/Profile';
import VacancyList from './components/vacancy/VacancyList';
import Recommendations from './components/user/Recommendations';
import TrackedVacancies from './components/user/TrackedVacancies';
import StudyMaterials from './components/user/StudyMaterials';

// Admin Components
import PostVacancy from './components/admin/PostVacancy';
import ManageVacancies from './components/admin/ManageVacancies';
import AllUsers from './components/admin/AllUsers';
import TrackedUsers from './components/admin/TrackedUsers';
import Categories from './components/admin/Categories';
import AdminStudyMaterials from './components/admin/StudyMaterials';
import UploadMaterial from './components/admin/UploadMaterial';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vacancies" element={<VacanciesPage />} />

          <Route
            path="/user"
            element={
              <ProtectedRoute role="User">
                <UserDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="profile" element={<Profile />} />
            <Route path="vacancies" element={<VacancyList />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="tracked" element={<TrackedVacancies />} />
            <Route path="study" element={<StudyMaterials />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="post-vacancy" element={<PostVacancy />} />
            <Route path="manage-vacancies" element={<ManageVacancies />} />
            <Route path="users" element={<AllUsers />} />
            <Route path="tracked-users" element={<TrackedUsers />} />
            <Route path="categories" element={<Categories />} />
            <Route path="study-materials" element={<AdminStudyMaterials />} />
            <Route path="upload-material" element={<UploadMaterial />} />
            <Route
              path="analytics"
              element={
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">
                    Analytics Dashboard - Coming Soon
                  </h3>
                </div>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
