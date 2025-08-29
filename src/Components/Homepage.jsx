import { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
  FaMusic,
  FaBars,
  FaTimes,
  FaHeart,
} from "react-icons/fa";
import { motion } from "framer-motion";

const collectionId = "Music_collection"; // Replace with your archive.org ID

const Homepage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Fetch songs dynamically
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch(`https://archive.org/metadata/${collectionId}`);
        const data = await res.json();
        const files = data.files.filter((f) => f.name.endsWith(".mp3"));

        const songList = files.map((file) => ({
          title: file.title || file.name.replace(".mp3", ""),
          artist: "Waha",
          src: `https://archive.org/download/${collectionId}/${file.name}`,
        }));

        setSongs(songList);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    };

    fetchSongs();
  }, []);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!songs.length) return;
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentIndex(nextIndex);
    setTimeout(() => audioRef.current.play(), 200);
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (!songs.length) return;
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentIndex(prevIndex);
    setTimeout(() => audioRef.current.play(), 200);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) audioRef.current.play();
    }
  }, [currentIndex]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 bg-black/70 backdrop-blur-md flex-col p-5 space-y-6 border-r border-gray-700">
        <h1 className="text-2xl font-bold text-cyan-400">🎵 waha's_Station</h1>

        {/* Scrollable Song List */}
        <nav className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800 rounded-lg">
          {songs.map((song, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setIsPlaying(true);
                setTimeout(() => audioRef.current.play(), 200);
              }}
              className="flex items-center gap-3 px-3 py-2 bg-gray-800/60 border border-gray-600 rounded-lg hover:bg-cyan-600/30 hover:text-cyan-400 transition text-left"
            >
              <FaMusic className="flex-shrink-0" />
              <span className="truncate w-full">{song.title}</span>
            </button>
          ))}
        </nav>
      </aside>


      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 relative">
        {/* Featured */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">Waha's_station</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {songs.map((song, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/60 backdrop-blur-lg rounded-xl shadow-lg p-3 cursor-pointer hover:bg-gray-700 transition"
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(true);
                  setTimeout(() => audioRef.current.play(), 200);
                }}
              >
                <img
                  src="https://picsum.photos/200/200"
                  alt={song.title}
                  className="rounded-lg mb-3 w-full h-32 object-cover"
                />
                <h3 className="font-semibold truncate">{song.title}</h3>
                <p className="text-gray-400 text-sm">{song.artist}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Player */}
      <footer className="fixed bottom-0 left-0 w-full bg-black/80 border-t border-gray-700 px-6 py-3 flex flex-col items-center gap-3 backdrop-blur-lg">
        {songs.length > 0 ? (
          <>
            {/* Song Info */}
            <div className="flex items-center gap-3 text-center">
              <img
                src="https://picsum.photos/50/50"
                alt="song"
                className="rounded-md"
              />
              <div>
                <h4 className="font-semibold text-sm sm:text-base">
                  {songs[currentIndex].title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  {songs[currentIndex].artist}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 justify-center">
              <button onClick={playPrev}>
                <FaStepBackward />
              </button>
              <button onClick={togglePlay}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={playNext}>
                <FaStepForward />
              </button>
              <FaHeart />
              <div className="flex items-center gap-2 ml-4">
                <FaVolumeUp />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => {
                    const newVolume = Number(e.target.value);
                    audioRef.current.volume = newVolume;
                    setVolume(newVolume);
                  }}
                  className="w-24 accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 w-full sm:w-2/3">
              <span className="text-xs text-gray-400">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => {
                  const seekTime = Number(e.target.value);
                  audioRef.current.currentTime = seekTime;
                  setCurrentTime(seekTime);
                }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <span className="text-xs text-gray-400">
                {formatTime(duration)}
              </span>
            </div>
          </>
        ) : (
          <p className="text-gray-400">Loading songs...</p>
        )}
      </footer>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={songs.length > 0 ? songs[currentIndex].src : ""}
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={playNext}
      />
    </div>
  );
};

export default Homepage;
