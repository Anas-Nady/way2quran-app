import React from "react";
import { createContext, useState, useContext } from "react";
import { IAudioFile } from "../types/types";

const AudioContext = createContext({
  currentAudio: null,
  playAudio: (newAudio: IAudioFile) => {},
});

export const AudioProvider = ({ children }) => {
  const [currentAudio, setCurrentAudio] = useState(null);

  const playAudio = (newAudio: IAudioFile) => {
    if (currentAudio && currentAudio !== newAudio) {
      currentAudio.pauseAsync();
    }
    setCurrentAudio(newAudio);
  };

  return (
    <AudioContext.Provider value={{ currentAudio, playAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
