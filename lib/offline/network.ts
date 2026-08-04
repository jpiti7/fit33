export function isOnline() {
  return typeof navigator === "undefined" ? true : navigator.onLine;
}

export function subscribeToNetworkStatus(callback: (online: boolean) => void) {
  const online = () => callback(true);
  const offline = () => callback(false);

  window.addEventListener("online", online);
  window.addEventListener("offline", offline);

  return () => {
    window.removeEventListener("online", online);
    window.removeEventListener("offline", offline);
  };
}
