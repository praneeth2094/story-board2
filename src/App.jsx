import { useState } from "react";
import audioList from "./data/audioList.json";
import AudioCard from "./components/AudioCard";

export default function App() {
  const [currentAudio, setCurrentAudio] = useState(null);
  const [theme, setTheme] = useState("dark"); // dark / light

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div className={`app ${theme}`}>
      {/* Header */}
      <header className="app-header">
        <h1>Our Story 💖</h1>
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
            className={currentAudio?.id === item.id ? "playing" : ""}
          />
        ))}
      </div>
    </div>
  );
}
