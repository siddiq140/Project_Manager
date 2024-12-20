import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Signin from "./pages/auth/Signin";
import Home from "./components/home/Home";
import Share from "./components/share/Share";
import "./App.css";

function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/share/:projectId" element={<Share />} />
         </Routes>
      </BrowserRouter>
   );
}

export default App;
