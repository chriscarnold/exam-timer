import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';

const ExamTimerApp = () => {
  const [part1Time, setPart1Time] = useState(180); // 3 minutes 
  const [part2Time, setPart2Time] = useState(210); // 3 minutes 30 
  const [part3Time, setPart3Time] = useState(210); // 3 minutes 30 
  const [totalTime, setTotalTime] = useState(0);
  const [activeTimer, setActiveTimer] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isAlarming, setIsAlarming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTotalTime(prevTime => prevTime + 1);
        if (activeTimer === 'part1') {
          setPart1Time(prevTime => {
            if (prevTime === 1) playAlarm();
            return prevTime > 0 ? prevTime - 1 : 0;
          });
        } else if (activeTimer === 'part2') {
          setPart2Time(prevTime => {
            if (prevTime === 1) playAlarm();
            return prevTime > 0 ? prevTime - 1 : 0;
          });
        } else if (activeTimer === 'part3') {
          setPart3Time(prevTime => {
            if (prevTime === 1) playAlarm();
            return prevTime > 0 ? prevTime - 1 : 0;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeTimer]);

  const playAlarm = () => {
    if (!isMuted) {
      audioRef.current.play();
    }
    setIsAlarming(true);
    setTimeout(() => setIsAlarming(false), 3000); // Reset after 3 seconds
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStart = (part) => {
    setActiveTimer(part);
    setIsRunning(true);
    setIsAlarming(false); // Stop any ongoing alarm
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = (part) => {
    setIsRunning(false);
    setIsAlarming(false); // Stop any ongoing alarm
    if (part === 'part1') setPart1Time(180);
    if (part === 'part2') setPart2Time(210);
    if (part === 'part3') setPart3Time(210);
  };

  const getPartCue = (part, time) => {
    if (part === 'part1') {
      const questionNumber = Math.floor((180 - time) / 36) + 1;
      return `You should be at Question ${questionNumber}`;
    } else if (part === 'part2' || part === 'part3') {
      if (time > 150) return 'You should be at 1 tense';
      if (time > 90) return 'You should be at 2 tenses';
      if (time > 30) return 'You should be at 3 tenses';
      return <span className="text-red-800 animate-pulse">Buffer</span>;
    }
  };

  const renderTimer = (part, time, setTime) => (
    <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">{`Part ${part.slice(-1)} Timer`}</h2>
      <div className="flex justify-between items-center">
        <div className="text-3xl font-mono">{formatTime(time)}</div>
        <div className="text-lg">{getPartCue(part, time)}</div>
      </div>
      <div className="mt-4 space-x-2">
        <button 
          onClick={() => handleStart(part)} 
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={isRunning && activeTimer === part}
        >
          Start
        </button>
        <button 
          onClick={handlePause} 
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          disabled={!isRunning || activeTimer !== part}
        >
          Pause
        </button>
        <button 
          onClick={() => handleStop(part)} 
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Speaking Exam Timer</h1>
      {renderTimer('part1', part1Time, setPart1Time)}
      {renderTimer('part2', part2Time, setPart2Time)}
      {renderTimer('part3', part3Time, setPart3Time)}
      {isAlarming && <div className="fixed top-0 right-0 bg-red-500 text-white p-4 m-4 rounded">Timer Ended!</div>}
      <div className="text-2xl font-bold mt-8">
        Total Time: 
        <span className={`ml-2 ${totalTime >= 600 ? 'text-red-500 animate-pulse' : totalTime >= 540 ? 'text-red-500' : ''}`}>
          {formatTime(totalTime)}
        </span>
        {totalTime >= 600 && <AlertCircle className="inline-block ml-2 text-red-500" />}
      </div>
      {totalTime >= 600 && <div className="text-red-500 font-bold mt-2">Exam time exceeded 10 minutes!</div>}
      <div className="mt-4">
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isMuted ? 'Unmute' : 'Mute'} Alarm
        </button>
      </div>
      <audio ref={audioRef} src="/alarm.mp3" />
    </div>
  );
};

export default ExamTimerApp;