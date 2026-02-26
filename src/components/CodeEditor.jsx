import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import "./CodeEditor.css";

export default function CodeEditor({ code, setCode, onReview, loading }) {
  const lines = code?.split("\n").length;
  const chars = code?.length;

  return (
    <div className="editor-wrapper">
      <div className="editor-toolbar">
        <div className="toolbar-right">
          <span className="code-stats">
            {lines} lines · {chars} chars
          </span>
          <button
            className="icon-btn"
            onClick={() => setCode("")}
            title="Clear editor"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6M9 6V4h6v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── CodeMirror ── */}
      <div className="cm-wrap">
        <CodeMirror
          value={code}
          onChange={setCode}
          theme={oneDark}
          height="100%"
          style={{ height: "100%" }}
          placeholder={`Paste your code here…`}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            autocompletion: true,
          }}
        />
      </div>

      {/* ── Footer ── */}
      <div className="editor-footer">
        <button
          className={`review-btn${loading ? " loading" : ""}`}
          onClick={onReview}
          disabled={loading || !code?.trim()}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Analyzing…
            </>
          ) : (
            <>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              Review Code
            </>
          )}
        </button>
      </div>
    </div>
  );
}
