import { createContext, useState, useContext } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentAudio, setCurrentAudio] = useState(null);

  const playAudio = (newAudio) => {
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
