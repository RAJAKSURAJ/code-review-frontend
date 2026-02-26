import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 3H4a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1z"
                fill="var(--accent)"
              />
              <path
                d="M8 15H4a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1z"
                fill="var(--accent)"
                opacity="0.5"
              />
              <path
                d="M20 9h-4a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1z"
                fill="var(--accent)"
                opacity="0.75"
              />
              <path
                d="M9 5h6M9 19h6M19 9V5M19 19v-4"
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="logo-text">
            CodeScan<span className="logo-ai">AI</span>
          </span>
        </div>

        <div className="header-divider" />
        <span className="header-tagline">Intelligent Code Review</span>
      </div>
    </header>
  );
}
