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
  FaRandom,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const collectionId = "Music_collection"; // Replace with your archive.org ID

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [expanded, setExpanded] = useState(false); // Mobile player expansion

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

  const shuffleSongs = () => {
    if (!songs.length) return;
    const shuffledIndex = Math.floor(Math.random() * songs.length);
    setShuffle(true);
    setCurrentIndex(shuffledIndex);
    setIsPlaying(true);
    setTimeout(() => audioRef.current.play(), 200);
  };

  const playNext = () => {
    if (!songs.length) return;
    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      nextIndex = (currentIndex + 1) % songs.length;
    }
    setCurrentIndex(nextIndex);
    setTimeout(() => audioRef.current.play(), 200);
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (!songs.length) return;
    let prevIndex;
    if (shuffle) {
      prevIndex = Math.floor(Math.random() * songs.length);
    } else {
      prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    }
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

  /* ----------- Desktop Sidebar ----------- */
  const DesktopSidebar = () => (
    <aside className="hidden md:flex w-56 bg-black/70 backdrop-blur-md flex-col p-5 space-y-6 border-r border-gray-700">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-cyan-400">🎵 Waha's_Station</h1>
        <button onClick={shuffleSongs}>
          <FaRandom className={shuffle ? "text-cyan-400" : ""} />
        </button>
      </div>

      {/* Scrollable Song List */}
      <nav className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800 rounded-lg">
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
  );

  /* ----------- Mobile Sidebar ----------- */
  const MobileSidebar = () => (
    <>
      <div className="flex justify-between items-center p-4 md:hidden bg-black/80 border-b border-gray-700">
        <motion.button
          onClick={() => setSidebarOpen(true)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ rotate: 90 }}
        >
          <FaBars className="text-xl" />
        </motion.button>
        <h1 className="text-lg font-bold text-cyan-400">🎵 Waha's_Station</h1>
        <button onClick={shuffleSongs}>
          <FaRandom className={shuffle ? "text-cyan-400" : ""} />
        </button>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex"
          >
            <div className="w-64 bg-black/90 p-5 flex flex-col space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-cyan-400">Playlist</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <FaTimes className="text-2xl" />
                </button>
              </div>
              <nav className="flex flex-col gap-2 overflow-y-auto">
                {songs.map((song, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsPlaying(true);
                      setSidebarOpen(false);
                      setTimeout(() => audioRef.current.play(), 200);
                    }}
                    className="flex items-center gap-3 px-3 py-2 bg-gray-800/60 border border-gray-600 rounded-lg hover:bg-cyan-600/30 hover:text-cyan-400 transition text-left"
                  >
                    <FaMusic />
                    <span className="truncate w-full">{song.title}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div
              className="flex-1 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col">
        <MobileSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 relative pb-40">
          <section className="mt-6">
            <h2 className="text-xl font-bold mb-4">Waha's Station</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {songs.map((song, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-800/70 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-3 cursor-pointer"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPlaying(true);
                    setTimeout(() => audioRef.current.play(), 200);
                  }}
                >
                  <img
                    src="https://picsum.photos/200/200"
                    alt={song.title}
                    className="rounded-lg mb-3 w-full h-32 object-cover shadow-md"
                  />
                  <h3 className="font-semibold truncate">{song.title}</h3>
                  <p className="text-gray-400 text-sm">{song.artist}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        {/* Bottom Player */}
        <footer
          className="fixed bottom-0 left-0 w-full bg-black/90 border-t border-gray-700 px-4 py-3 flex flex-col items-center gap-2 backdrop-blur-lg"
          onClick={() => setExpanded(true)}
        >
          {songs.length > 0 ? (
            <>
              {/* Song Info */}
              <div className="flex items-center gap-3 text-center w-full sm:w-auto justify-center sm:justify-start">
                <img
                  src="https://picsum.photos/70/50"
                  alt="song"
                  className="rounded-md w-12 h-10 sm:w-16 sm:h-12"
                />
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm">
                    {songs[currentIndex].title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    {songs[currentIndex].artist}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-5 justify-center text-xl sm:text-base">
                <button onClick={(e) => { e.stopPropagation(); playPrev(); }}>
                  <FaStepBackward />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                  className="p-2 bg-cyan-500 rounded-full text-black text-2xl sm:text-xl"
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); playNext(); }}>
                  <FaStepForward />
                </button>
                <button onClick={(e) => { e.stopPropagation(); shuffleSongs(); }}>
                  <FaRandom className={shuffle ? "text-cyan-400" : ""} />
                </button>
                <div className="flex items-center gap-2">
                  <FaVolumeUp />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => {
                      const vol = Number(e.target.value);
                      audioRef.current.volume = vol;
                      setVolume(vol);
                    }}
                    className="w-20 accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-2 w-full sm:w-2/3">
                <span className="text-[10px] sm:text-xs text-gray-400">
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
                <span className="text-[10px] sm:text-xs text-gray-400">
                  {formatTime(duration)}
                </span>
              </div>
            </>
          ) : (
            <p className="text-gray-400">Loading songs...</p>
          )}
        </footer>

        {/* Expanded Mobile Player */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between items-center p-6"
            >
              {/* Drag Handle */}
              <div
                className="w-12 h-1 bg-gray-500 rounded-full mt-2 cursor-pointer"
                onClick={() => setExpanded(false)}
              ></div>

              {/* Center Section (Album + Info) */}
              <div className="flex flex-col items-center justify-center flex-1">
                <img
                  src="https://picsum.photos/300/300"
                  alt="album"
                  className="rounded-xl shadow-lg w-64 h-64 object-cover mb-6"
                />
                <h2 className="text-lg font-bold text-center">
                  {songs[currentIndex].title}
                </h2>
                <p className="text-gray-400 mb-6 text-center">
                  {songs[currentIndex].artist}
                </p>
              </div>

              {/* Bottom Controls Section */}
              <div className="w-full flex flex-col items-center gap-6 pb-6">
                {/* Controls */}
                <div className="flex items-center gap-6 justify-center text-3xl">
                  <button onClick={playPrev}>
                    <FaStepBackward />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="p-4 bg-cyan-500 rounded-full text-black text-4xl"
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <button onClick={playNext}>
                    <FaStepForward />
                  </button>
                  <button onClick={shuffleSongs}>
                    <FaRandom className={shuffle ? "text-cyan-400" : ""} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-2 w-full px-4">
                  <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
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
                  <span className="text-xs text-gray-400">{formatTime(duration)}</span>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <FaVolumeUp />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => {
                      const vol = Number(e.target.value);
                      audioRef.current.volume = vol;
                      setVolume(vol);
                    }}
                    className="w-32 accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={songs.length > 0 ? songs[currentIndex].src : ""}
          onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
          onLoadedMetadata={() => setDuration(audioRef.current.duration)}
          onEnded={playNext}
        />
      </div>
    </div>
  );
};

export default Home;
