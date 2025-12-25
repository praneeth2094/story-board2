import { useEffect, useRef, useState } from "react";

export default function AudioCard({ data, currentAudio, setCurrentAudio }) {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Pause this audio if another card starts playing
  useEffect(() => {
    if (currentAudio !== audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentAudio, isPlaying]);

  // Toggle play/pause
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
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);
    setProgress((audio.currentTime / audio.duration) * 100 || 0);
  };

  // Mini waveform visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrame;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 20;
      for (let i = 0; i < barCount; i++) {
        const height = Math.random() * 10;
        ctx.fillStyle = "#ff4d6d";
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
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className={`card ${currentAudio === audioRef.current ? "playing" : ""}`}>
      {/* Cover Image */}
      <img src={data.image} alt={data.title} className="cover" />

      {/* Play / Pause Button */}
      <button className="play-btn" onClick={togglePlay}>
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </button>

      {/* Progress Slider */}
      <input
        type="range"
        className="progress"
        value={progress}
        style={{ "--progress": `${progress}%` }}
        onChange={(e) => {
          const audio = audioRef.current;
          if (!audio) return;
          const time = (e.target.value / 100) * audio.duration;
          audio.currentTime = time;
          setProgress(e.target.value);
        }}
      />

      {/* Time Display */}
      <div className="time-display">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Mini Waveform Visualizer */}
      <canvas ref={canvasRef} width={120} height={20} className="visualizer" />

      {/* Audio Title */}
      <p className="title">{data.title}</p>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={data.audio}
        onTimeUpdate={updateProgress}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}


