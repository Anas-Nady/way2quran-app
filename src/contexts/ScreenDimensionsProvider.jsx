import { createContext, useState, useEffect } from "react";
import { Dimensions } from "react-native";

export const ScreenDimensionsContext = createContext();

export const ScreenDimensionsProvider = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

  useEffect(() => {
    const updateScreenDimensions = () => {
      setScreenWidth(Dimensions.get("window").width);
      setScreenHeight(Dimensions.get("window").height);
    };

    const dimensionChangeListener = Dimensions.addEventListener(
      "change",
      updateScreenDimensions
    );

    return () => {
      dimensionChangeListener?.remove();
    };
  }, []);

  return (
    <ScreenDimensionsContext.Provider value={{ screenWidth, screenHeight }}>
      {children}
    </ScreenDimensionsContext.Provider>
  );
};
