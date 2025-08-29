import { HashRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Use index route for "/" */}
        <Route index element={<Homepage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
