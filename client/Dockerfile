# Frontend Dockerfile

# Utiliser l'image officielle Node.js LTS comme base
FROM node:16-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json du frontend
COPY client/package.json client/package-lock.json ./

# Installer les dépendances frontend
RUN npm install

# Copier tout le code de l'application frontend dans le conteneur
COPY client .

# Construire l'application frontend
RUN npm run build

# Utiliser une image Nginx pour servir l'application frontend
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Exposer le port de l'application frontend
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
