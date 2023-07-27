Setup :

- Cloner le repo GIT : https://github.com/MaximeLefeb/dailyMeeting-bot/tree/master

- Activer le mode développeur sur son compte Discord (Paramètres utilisateur > Avancés > Mode développeur)

- Créer un bot : https://discord.com/developers/applications > New Application > Nommé son bot > Create

- Coller l'id d'application dans config.json['clientId'] : https://discord.com/developers/applications/[APP_ID]/information > APPLICATION ID

- Coller le token d'application dans config.json['token'] : https://discord.com/developers/applications/[APP_ID]/bot > Reset Token > Yes

- Modifier les Intends du bot : https://discord.com/developers/applications/[APP_ID]/bot > Privileged Gateway Intents > Check PRESENCE INTENT, SERVER MEMBERS INTENT, MESSAGE CONTENT INTENT > Bot permissions > Administrator > Save changes

- Coller l'id de la salle du serveur dans config.json['guildId'] : Discord app > Server list > Mon server > clique droit sur l'icone du serveur > Copier l'identifiant du serveur

- Coller l'id de la salle de meeting textuel dans config.json['meetingTextRoomId'] : Discord app > Server list > Mon server > clique droit sur le nom du channel textuel souhaité > Copier l'identifiant du salon

- Coller l'id de la salle de meeting vocal dans config.json['meetingRoomId'] : Discord app > Server list > Mon server > clique droit sur le nom du channel vocal souhaité > Copier l'identifiant du salon

- Inviter votre bot : https://discord.com/developers/applications/[APP_ID]/oauth2/url-generator > Scopes : Check bot & applications.commands > Bot permissions : Check Administrator > Copier le lien généré (Generated url) > Coller l'url sur un navigateur web et choisir le serveur sur lequel le bot va etre actif

- Coller les informations de base données dans config.json['host'], config.json['user'], config.json['port'], config.json['password'], config.json['database']

- Démarer son serveur Mysql (https://www.apachefriends.org/fr/download.html)

- Ouvrir un terminal dans la racine du projet et lancer la commande : npm install (https://nodejs.org/en/download)

- Toujours dans le terminal à la racine du projet et lancer : node .

---

Commands :

- /meetup : Lance l'organisation d'un daily meeting pour 09h05 (Du Lundi au Vendredi)

- /cheers : Félicter facilement l'intégralité de votre équipe

- /cheersto : Félicter un membre de votre équipe

---
