import { useEffect, useRef, useState } from "react";

export default function AudioCard({ data, currentAudio, setCurrentAudio }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Pause if another card starts playing
  useEffect(() => {
    if (currentAudio !== audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentAudio]);

  const togglePlay = () => {
    if (!isPlaying) {
      setCurrentAudio(audioRef.current);
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const updateProgress = () => {
    const percent =
      (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(percent || 0);
  };

  return (
    <div className="card">
      <img src={data.image} alt={data.title} className="cover" />

      <button className="play-btn" onClick={togglePlay}>
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </button>

      <input
        type="range"
        className="progress"
        value={progress}
        onChange={(e) => {
          const time =
            (e.target.value / 100) * audioRef.current.duration;
          audioRef.current.currentTime = time;
          setProgress(e.target.value);
        }}
      />

      <p className="title">{data.title}</p>

      <audio
        ref={audioRef}
        src={data.audio}
        onTimeUpdate={updateProgress}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
