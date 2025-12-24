import { useState } from "react";
import audioList from "./data/audioList.json";
import AudioCard from "./components/AudioCard";

export default function App() {
  const [currentAudio, setCurrentAudio] = useState(null);

  return (
    <div className="app">
      <h1 className="header">Our Story 💖</h1>

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
  );
}
