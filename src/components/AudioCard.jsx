import { useEffect, useRef, useState } from "react";

export default function AudioCard({ data, currentAudio, setCurrentAudio }) {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const audioSliderRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  // Update progress and time
  const updateProgress = () => {
    const audio = audioRef.current;
    const current = audio.currentTime;
    const dur = audio.duration || 0;
    setCurrentTime(current);
    setDuration(dur);
    const prog = (current / dur) * 100 || 0;
    setProgress(prog);

    // Update CSS variable for gradient
    if (audioSliderRef.current) {
      audioSliderRef.current.style.setProperty("--progress", `${prog}%`);
    }
  };

  // Enhanced mini waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrame;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 20;
      for (let i = 0; i < barCount; i++) {
        const height = Math.random() * 10 + 5;
        const isHighlight = Math.random() < 0.2;
        ctx.fillStyle = isHighlight ? "#3498DB" : "#2ECC71"; // secondary blue / primary green
        ctx.fillRect(i * 6, canvas.height - height, 4, height);
      }
      animationFrame = requestAnimationFrame(draw);
    };

    if (isPlaying) draw();
    else ctx.clearRect(0, 0, canvas.width, canvas.height);

    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className={`card ${isPlaying ? "playing" : ""}`}>
      <img src={data.image} alt={data.title} className="cover" />

      <button className="play-btn" onClick={togglePlay}>
        {isPlaying ? (
          <svg viewBox="0 0 64 64">
            <rect x="14" y="12" width="10" height="40" />
            <rect x="40" y="12" width="10" height="40" />
          </svg>
        ) : (
          <svg viewBox="0 0 64 64">
            <polygon points="16,12 52,32 16,52" />
          </svg>
        )}
      </button>

      <input
        ref={audioSliderRef}
        type="range"
        className="progress"
        value={progress}
        onChange={(e) => {
          const time = (e.target.value / 100) * audioRef.current.duration;
          audioRef.current.currentTime = time;
          setProgress(e.target.value);
          e.target.style.setProperty("--progress", `${e.target.value}%`);
        }}
      />

      <div className="time-display">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      <canvas
        ref={canvasRef}
        width={120}
        height={20}
        className="visualizer"
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
