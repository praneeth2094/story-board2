import { useState } from "react";
import audioList from "./data/audioList.json";
import AudioCard from "./components/AudioCard";
import PasswordGate from "./components/PasswordGate";

export default function App() {
  const [currentAudio, setCurrentAudio] = useState(null);
  const [theme, setTheme] = useState("dark"); // dark / light

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <PasswordGate>
      <div className={`app ${theme}`}>
        {/* Header */}
        <header className="app-header">
          <div className="header-accent" />

          <h1 className="app-title">Stories for you</h1>
          <p className="app-subtitle">
            A private collection of narrated stories
          </p>

          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
          </button>
        </header>

        {/* Audio Cards */}
        <div className="card-list">
          {audioList.map((item) => (
            <AudioCard
              key={item.id}
              data={item}
              currentAudio={currentAudio}
              setCurrentAudio={setCurrentAudio}
            />
          ))}
        </div>
      </div>
    </PasswordGate>
  );
}
