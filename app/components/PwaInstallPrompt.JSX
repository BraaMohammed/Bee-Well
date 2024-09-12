"use client"
import { useEffect, useState } from 'react';

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallPromptVisible, setInstallPromptVisible] = useState(false);

  console.log('component loadedd brooooooooooo')

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        setDeferredPrompt(e);
        // Update UI to show the install button
        setInstallPromptVisible(true);
      });
    }
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user's response
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        // Reset the deferredPrompt variable
        setDeferredPrompt(null);
        // Hide the install button
        setInstallPromptVisible(false);
      });
    }
  };

  return (
    <>
      {isInstallPromptVisible && (
        <button onClick={handleInstallClick}>Install App</button>
      )}
    </>
  );
};

export default PwaInstallPrompt;


