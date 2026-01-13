import { Routes, Route } from "react-router-dom";
import Quiz from "./quiz/Quiz";
import Auth from "./auth/Auth";
import Home from "./home/Home";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <div className="mx-auto relative min-h-screen text-white font-medium max-w-480">
      <div
        className="absolute inset-0 bg-cover bg-center z-1 opacity-5"
        style={{ backgroundImage: "url('/abst_background.jpg')" }}
      />

      <div className="absolute inset-0 bg-linear-to-tr from-cyan-950 to-cyan-800" />

      <div className="relative z-10 min-h-screen">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
          </Route>
          <Route path="*" element={<h1>Halaman tidak ditemukan</h1>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
