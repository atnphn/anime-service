import { BrowserRouter, Routes, Route } from "react-router-dom";
import CaseOpening from "./features/case-opening/CaseOpening";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CaseOpening />} />
        <Route path="/mo-hom" element={<CaseOpening />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
