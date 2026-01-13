import { Routes, Route } from "react-router-dom";
import Quiz from "./quiz/Quiz";
import Auth from "./auth/Auth";
import Home from "./home/Home";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
        </Route>
        <Route path="*" element={<h1>Halaman tidak ditemukan</h1>} />
      </Routes>
    </div>
  );
}

export default App;
