# Backend Dockerfile

# Utiliser l'image officielle Node.js LTS comme base
FROM node:16-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package.json .

# Installer les dépendances backend
RUN npm install

# Copier tout le code de l'application backend dans le conteneur
COPY . .

# Exposer le port de l'application
EXPOSE 8080

# Démarrer l'application backend
CMD ["npm", "start"]

