import { useState, useCallback } from "react";
import axios from "axios";
import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";
import ReviewPanel from "./components/ReviewPanel";
import "./App.css";

const API_BASE =
  "https://code-review-gen-ai-nodejs.vercel.app" || "http://localhost:8000";

export default function App() {
  const [code, setCode] = useState();

  const [language, setLanguage] = useState("python");
  const [context, setContext] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReview = useCallback(async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setReview(null);

    try {
      const { data } = await axios.post(`${API_BASE}/api/review`, {
        code,
        context: context || undefined,
      });
      setReview(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to connect to the review service. Is the backend running on port 8000?",
      );
    } finally {
      setLoading(false);
    }
  }, [code, context]);

  return (
    <div className="app">
      <Header />
      <main className="main-layout">
        <section className="editor-section">
          <CodeEditor
            code={code}
            setCode={setCode}
            // language={language}
            // setLanguage={setLanguage}
            context={context}
            setContext={setContext}
            onReview={handleReview}
            loading={loading}
          />
        </section>
        <section className="review-section">
          <ReviewPanel
            review={review}
            loading={loading}
            error={error}
            // language={language}
          />
        </section>
      </main>
    </div>
  );
}
