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
import { useEffect } from "react";
import { useState } from "react";

const BASIC_AUTH_USER = "demo";
const BASIC_AUTH_PASS = "password123";

// Precomputed expected token
const EXPECTED_AUTH_TOKEN =
  "Basic " + btoa(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASS}`);


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if stored token matches what we expect
    const saved = localStorage.getItem("auth");
    return saved === EXPECTED_AUTH_TOKEN;
  });

  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    // If already authenticated (from localStorage), we're done
    if (isAuthenticated) {
      setCheckedAuth(true);
      return;
    }

    // Otherwise, prompt user for credentials
    const inputUsername = prompt("Username:");
    const inputPassword = prompt("Password:");

    // If user cancelled either prompt
    if (inputUsername == null || inputPassword == null) {
      alert("Authentication required.");
      // optional: redirect away / close tab
      setCheckedAuth(true);
      return;
    }

    const providedToken =
      "Basic " + btoa(`${inputUsername}:${inputPassword}`);

    if (providedToken === EXPECTED_AUTH_TOKEN) {
      localStorage.setItem("auth", providedToken);
      setIsAuthenticated(true);
    } else {
      alert("Invalid username or password.");
      // optional: you can retry, reload, or just stop here
      // window.location.reload();
    }

    setCheckedAuth(true);
  }, [isAuthenticated]);

  // Don’t render the app until we’ve finished the auth check
  if (!checkedAuth || !isAuthenticated) {
    // You can render a blank screen or a simple message if you want:
    return null;
    // return <div style={{ padding: 20 }}>Authenticating…</div>;
  }
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
