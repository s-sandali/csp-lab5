import { useEffect, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

function App() {
  const [status, setStatus] = useState({ loading: true, error: "", data: null });

  useEffect(() => {
    const controller = new AbortController();

    async function loadStatus() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/health`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setStatus({ loading: false, error: "", data });
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setStatus({
          loading: false,
          error: error.message || "Unable to reach the API.",
          data: null
        });
      }
    }

    loadStatus();

    return () => controller.abort();
  }, []);

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">CSP Lab 5</p>
        <h1>React Front End + .NET Web API</h1>
        <p className="lead">
          This React app calls an ASP.NET Core API running locally to verify the
          full-stack setup before deployment to Azure.
        </p>

        <div className="status-panel">
          <h2>API Check</h2>
          {status.loading && <p>Contacting {apiBaseUrl} ...</p>}
          {!status.loading && status.error && (
            <p className="status-error">API unavailable: {status.error}</p>
          )}
          {!status.loading && status.data && (
            <div className="status-success">
              <p>
                <strong>Message:</strong> {status.data.message}
              </p>
              <p>
                <strong>Environment:</strong> {status.data.environment}
              </p>
              <p>
                <strong>Time:</strong> {status.data.timestamp}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
