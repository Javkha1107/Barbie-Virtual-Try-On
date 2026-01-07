import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { BrowserCompatibilityWarning } from "./components/BrowserCompatibilityWarning";
import { HomeScreen } from "./screens/HomeScreen";
import { RecordingScreen } from "./screens/RecordingScreen";
import { ClothingSelectionScreen } from "./screens/ClothingSelectionScreen";
import { LoadingScreen } from "./screens/LoadingScreen";
import { ResultScreen } from "./screens/ResultScreen";

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <BrowserCompatibilityWarning />
          <ErrorDisplay />
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/recording" element={<RecordingScreen />} />
            <Route
              path="/clothing-selection"
              element={<ClothingSelectionScreen />}
            />
            <Route path="/loading" element={<LoadingScreen />} />
            <Route path="/result" element={<ResultScreen />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
