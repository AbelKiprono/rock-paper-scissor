const SOCKET_URL = 'https://rock-paper-scissor-4x79.onrender.com'; // Example: use your real one

export const useSocketConnection = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketReady, setSocketReady] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setSocketReady(true);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setSocketReady(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, socketReady };
};
