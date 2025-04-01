import React, { useState } from "react";
import AppNavigator from "./navigation";
import SplashScreenComponent from "./screens/SplashScreenComponent";

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  if (!isAppReady) {
    return <SplashScreenComponent onFinish={() => setIsAppReady(true)} />;
  }

  return <AppNavigator />;
}
