import { useState } from "react";
import "./ReviewPanel.css";

/* ── helpers ── */
const SEV = {
  error: { label: "Error", cls: "error", icon: "✕" },
  warning: { label: "Warning", cls: "warning", icon: "⚠" },
  suggestion: { label: "Suggestion", cls: "suggestion", icon: "✦" },
};

/* ── sub-components ── */

function ScoreRing({ score }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const off = c - (score / 10) * c;
  const col =
    score >= 8
      ? "var(--score-high)"
      : score >= 5
        ? "var(--score-mid)"
        : "var(--score-low)";

  return (
    <svg width="90" height="90" viewBox="0 0 90 90" className="score-ring">
      <circle
        cx="45"
        cy="45"
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth="5"
      />
      <circle
        cx="45"
        cy="45"
        r={r}
        fill="none"
        stroke={col}
        strokeWidth="5"
        strokeDasharray={c}
        strokeDashoffset={off}
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
        style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s" }}
      />
      <text
        x="45"
        y="42"
        textAnchor="middle"
        fill={col}
        fontSize="20"
        fontWeight="700"
        fontFamily="'Syne',sans-serif"
      >
        {score}
      </text>
      <text
        x="45"
        y="56"
        textAnchor="middle"
        fill="var(--text-muted)"
        fontSize="9"
        fontFamily="'DM Sans',sans-serif"
      >
        / 10
      </text>
    </svg>
  );
}

function IssueCard({ issue }) {
  const [open, setOpen] = useState(false);
  const s = SEV[issue.severity] || SEV.suggestion;

  return (
    <div
      className={`issue-card sev-${s.cls}`}
      onClick={() => setOpen((o) => !o)}
    >
      <div className="issue-header">
        <div className="issue-left">
          <span className={`issue-icon icon-${s.cls}`}>{s.icon}</span>
          <div>
            <p className="issue-title">{issue.title}</p>
            {issue.line && <p className="issue-line">Line {issue.line}</p>}
          </div>
        </div>
        <div className="issue-right">
          <span className={`badge badge-${s.cls}`}>{s.label}</span>
          <span className={`chevron${open ? " open" : ""}`}>▸</span>
        </div>
      </div>

      {open && (
        <div className="issue-body">
          <p className="issue-desc">{issue.description}</p>
          {issue.suggestion && (
            <div className="issue-fix">
              <span className="fix-tag">Fix</span>
              <p>{issue.suggestion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="state-wrap">
      <div className="state-icon">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="1.2"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <circle cx="12" cy="14" r="3" />
        </svg>
      </div>
      <h3>Ready to Review</h3>
      <p>
        Paste your code on the left and click <strong>Review Code</strong> to
        get AI-powered feedback.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="state-wrap">
      <div className="bars">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="bar"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <h3>Analyzing your code…</h3>
      <p>Checking for issues, best practices &amp; improvements</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="state-wrap">
      <div className="state-icon err-icon">✕</div>
      <h3>Review Failed</h3>
      <p>{message}</p>
    </div>
  );
}

/* ── main export ── */

export default function ReviewPanel({ review, loading, error, language }) {
  const [filter, setFilter] = useState("all");
  const [showImproved, setShowImproved] = useState(false);

  if (loading)
    return (
      <div className="review-panel">
        <LoadingState />
      </div>
    );
  if (error)
    return (
      <div className="review-panel">
        <ErrorState message={error} />
      </div>
    );
  if (!review)
    return (
      <div className="review-panel">
        <EmptyState />
      </div>
    );

  const counts = {
    error: review.issues.filter((i) => i.severity === "error").length,
    warning: review.issues.filter((i) => i.severity === "warning").length,
    suggestion: review.issues.filter((i) => i.severity === "suggestion").length,
  };

  const visible =
    filter === "all"
      ? review.issues
      : review.issues.filter((i) => i.severity === filter);

  return (
    <div className="review-panel">
      {/* ── Score header ── */}
      <div className="review-header">
        <div className="score-row">
          <ScoreRing score={review.score} />
          <div>
            <p className="score-label">Code Quality Score</p>
            <p className="summary-text">{review.summary}</p>
          </div>
        </div>

        <div className="count-pills">
          {counts.error > 0 && (
            <span className="cpill cpill-error">
              {" "}
              <b>{counts.error}</b> Errors
            </span>
          )}
          {counts.warning > 0 && (
            <span className="cpill cpill-warning">
              {" "}
              <b>{counts.warning}</b> Warnings
            </span>
          )}
          {counts.suggestion > 0 && (
            <span className="cpill cpill-suggestion">
              {" "}
              <b>{counts.suggestion}</b> Suggestions
            </span>
          )}
          {review.issues.length === 0 && (
            <span className="cpill cpill-clean">✓ No Issues Found</span>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="review-body">
        {/* Issues */}
        {review.issues.length > 0 && (
          <section className="rp-section">
            <div className="rp-section-head">
              <h3>
                Issues <span className="rp-count">{review.issues.length}</span>
              </h3>
              <div className="filters">
                {["all", "error", "warning", "suggestion"].map((f) => (
                  <button
                    key={f}
                    className={`ftab${filter === f ? " active" : ""}${f !== "all" ? ` ftab-${f}` : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === "all"
                      ? "All"
                      : f.charAt(0).toUpperCase() + f.slice(1)}
                    {f !== "all" && counts[f] > 0 && (
                      <span className="ftab-n">{counts[f]}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="issues-list">
              {visible.length > 0 ? (
                visible.map((issue, i) => (
                  <IssueCard key={issue.id ?? i} issue={issue} />
                ))
              ) : (
                <p className="no-match">No {filter} issues.</p>
              )}
            </div>
          </section>
        )}

        {/* Positives */}
        {review.positives?.length > 0 && (
          <section className="rp-section">
            <div className="rp-section-head">
              <h3>
                What's Good{" "}
                <span className="rp-count">{review.positives.length}</span>
              </h3>
            </div>
            <div className="positives-list">
              {review.positives.map((p, i) => (
                <div key={i} className="positive-item">
                  <span className="pos-check">✓</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Improved code */}
        {review.improved_code && (
          <section className="rp-section">
            <div className="rp-section-head">
              <h3>Improved Version</h3>
              <button
                className="toggle-btn"
                onClick={() => setShowImproved((v) => !v)}
              >
                {showImproved ? "Hide" : "Show"} code
              </button>
            </div>
            {showImproved && (
              <div className="code-block">
                <div className="code-block-head">
                  <span>{language}</span>
                  <button
                    className="copy-btn"
                    onClick={() =>
                      navigator.clipboard.writeText(review.improved_code)
                    }
                  >
                    Copy
                  </button>
                </div>
                <pre className="code-pre">
                  <code>{review.improved_code}</code>
                </pre>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
