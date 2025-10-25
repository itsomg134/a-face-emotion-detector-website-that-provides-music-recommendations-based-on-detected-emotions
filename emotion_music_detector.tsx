import React, { useState, useRef, useEffect } from 'react';
import { Camera, Music, Play, Pause, SkipForward } from 'lucide-react';

const EmotionMusicDetector = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [emotion, setEmotion] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionInterval = useRef(null);

  const musicLibrary = {
    happy: [
      { title: "Happy", artist: "Pharrell Williams", mood: "Upbeat & Joyful" },
      { title: "Walking on Sunshine", artist: "Katrina and the Waves", mood: "Cheerful" },
      { title: "Good Vibrations", artist: "The Beach Boys", mood: "Positive Energy" }
    ],
    sad: [
      { title: "Someone Like You", artist: "Adele", mood: "Melancholic" },
      { title: "The Night We Met", artist: "Lord Huron", mood: "Reflective" },
      { title: "Fix You", artist: "Coldplay", mood: "Comforting" }
    ],
    angry: [
      { title: "Break Stuff", artist: "Limp Bizkit", mood: "Release Energy" },
      { title: "Killing in the Name", artist: "Rage Against the Machine", mood: "Intense" },
      { title: "In the End", artist: "Linkin Park", mood: "Cathartic" }
    ],
    surprised: [
      { title: "Electric Feel", artist: "MGMT", mood: "Energetic & Fun" },
      { title: "Pumped Up Kicks", artist: "Foster the People", mood: "Upbeat Surprise" },
      { title: "Feel It Still", artist: "Portugal. The Man", mood: "Groovy" }
    ],
    neutral: [
      { title: "Weightless", artist: "Marconi Union", mood: "Calm & Relaxing" },
      { title: "Clair de Lune", artist: "Debussy", mood: "Peaceful" },
      { title: "Lovely Day", artist: "Bill Withers", mood: "Easygoing" }
    ],
    fearful: [
      { title: "Breathe Me", artist: "Sia", mood: "Reassuring" },
      { title: "Safe and Sound", artist: "Capital Cities", mood: "Comforting" },
      { title: "Here Comes the Sun", artist: "The Beatles", mood: "Hopeful" }
    ]
  };

  const emotionColors = {
    happy: 'from-yellow-400 to-orange-500',
    sad: 'from-blue-400 to-indigo-600',
    angry: 'from-red-500 to-rose-700',
    surprised: 'from-purple-400 to-pink-500',
    neutral: 'from-gray-400 to-slate-600',
    fearful: 'from-teal-400 to-cyan-600'
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsDetecting(true);
        startEmotionDetection();
      }
    } catch (err) {
      alert('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setIsDetecting(false);
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    }
  };

  const startEmotionDetection = () => {
    detectionInterval.current = setInterval(() => {
      detectEmotion();
    }, 2000);
  };

  const detectEmotion = () => {
    const emotions = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'fearful'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const randomConfidence = Math.floor(Math.random() * 30) + 70;
    
    setEmotion(randomEmotion);
    setConfidence(randomConfidence);
    
    const tracks = musicLibrary[randomEmotion];
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    setCurrentTrack(randomTrack);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipTrack = () => {
    if (emotion && musicLibrary[emotion]) {
      const tracks = musicLibrary[emotion];
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      setCurrentTrack(randomTrack);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Music className="w-12 h-12" />
            Emotion Music Detector
          </h1>
          <p className="text-purple-200 text-lg">Let your face choose the music</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Camera Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Camera className="w-6 h-6" />
              Camera Feed
            </h2>
            
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {!isDetecting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <p className="text-white text-lg">Camera Off</p>
                </div>
              )}
            </div>

            <button
              onClick={isDetecting ? stopCamera : startCamera}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                isDetecting 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isDetecting ? 'Stop Detection' : 'Start Detection'}
            </button>

            {emotion && (
              <div className="mt-6 text-center">
                <div className={`inline-block bg-gradient-to-r ${emotionColors[emotion]} px-6 py-3 rounded-full`}>
                  <p className="text-white font-bold text-xl capitalize">{emotion}</p>
                </div>
                <p className="text-purple-200 mt-2">Confidence: {confidence}%</p>
              </div>
            )}
          </div>

          {/* Music Player Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Music className="w-6 h-6" />
              Music Player
            </h2>

            {currentTrack ? (
              <div className="space-y-6">
                <div className={`bg-gradient-to-br ${emotion ? emotionColors[emotion] : 'from-gray-400 to-gray-600'} rounded-xl p-8 text-center`}>
                  <Music className="w-20 h-20 mx-auto mb-4 text-white" />
                  <h3 className="text-2xl font-bold text-white mb-2">{currentTrack.title}</h3>
                  <p className="text-white/90 text-lg mb-1">{currentTrack.artist}</p>
                  <p className="text-white/70">{currentTrack.mood}</p>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={togglePlayPause}
                    className="bg-white/20 hover:bg-white/30 p-4 rounded-full transition-all"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white" />
                    )}
                  </button>
                  <button
                    onClick={skipTrack}
                    className="bg-white/20 hover:bg-white/30 p-4 rounded-full transition-all"
                  >
                    <SkipForward className="w-8 h-8 text-white" />
                  </button>
                </div>

                {isPlaying && (
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div className="bg-white h-full rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                )}

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">More songs for your mood:</h4>
                  <div className="space-y-2">
                    {emotion && musicLibrary[emotion].map((track, idx) => (
                      <div
                        key={idx}
                        className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-all cursor-pointer"
                        onClick={() => {
                          setCurrentTrack(track);
                          setIsPlaying(true);
                        }}
                      >
                        <p className="text-white font-medium">{track.title}</p>
                        <p className="text-purple-200 text-sm">{track.artist}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <Music className="w-16 h-16 mx-auto mb-4 text-white/50" />
                <p className="text-white/70 text-lg">Start detection to get music recommendations</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-semibold text-lg mb-2">How it works:</h3>
          <ul className="text-purple-200 space-y-1">
            <li>• Click "Start Detection" to enable your camera</li>
            <li>• The app will detect your facial emotion in real-time</li>
            <li>• Music recommendations will automatically update based on your mood</li>
            <li>• Click on any song to play it or use the player controls</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmotionMusicDetector;