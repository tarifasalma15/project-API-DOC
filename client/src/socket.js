import { io } from 'socket.io-client';

const socket = io('http://localhost:8080'); // Remplacez par l'URL de votre serveur en production

export default socket;