[![Run on Repl.it](https://repl.it/badge/github/brblacky/lavamusic)](https://replit.com/@brblacky1/lavamusic?v=1)
[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/brblacky/lavamusic)
<a href="https://heroku.com/deploy?template=https://github.com/brblacky/lavamusic">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>


[![Version][version-shield]](version-url)
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
<center><img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=lavamusic&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=gradient" /></center>


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/brblacky/lavamusic">
    <img src="https://media.discordapp.net/attachments/876035356460462090/887728792926290091/20210820_124325.png" alt="Pbot-plus" width="200" height="200">
  </a>

  <h3 align="center">lavamusic</h3>

  <p align="center">
    Lavamusic is  a powerful music Bot
    <br />
    <br />
    <a href="https://discord.com/api/oauth2/authorize?client_id=875635121770889257&permissions=36768832&scope=applications.commands%20bot">Invite Lavamusic</a>
    ·
    <a href="https://github.com/brblacky/lavamusic/issues">Report Bug</a>
    ·
    <a href="https://github.com/brblacky/lavamusic/issues">Request Feature</a>
  </p>
</p>


## 📝 Tutorial

A Tutorial has been uploaded on YouTube, Watch it by clicking [here](https://youtu.be/x5lQD2rguz0)


## 🎭 Features

- [x] Music
- [x] 24/7
- [x] custom prefix
- [x] filters
- [x] More


## 🖼️ Screenshots
<br />
<p align="center">
  <a href="https://github.com/brblacky/lavamusic">
    <img src="https://media.discordapp.net/attachments/876035356460462090/889326832380411904/Screenshot_20210920-071348__01.jpg">
    <img src="https://media.discordapp.net/attachments/876035356460462090/889326832686616646/Screenshot_20210920-071527__01.jpg">
    <img src="https://media.discordapp.net/attachments/876035356460462090/889326831965208616/Screenshot_20210920-071638__01.jpg">

  </a>
</p>

## 📎 Requirements
* [Nodejs](https://nodejs.org/en/)-v16 
* [Discord.js](https://github.com/discordjs/discord.js/)-v13
* [Java](https://adoptopenjdk.net/) for lavalink
* [Lavalink](https://ci.fredboat.com/viewLog.html?buildId=lastSuccessful&buildTypeId=Lavalink_Build&tab=artifacts&guest=1)

Note: Java v11 or newer is required to run the Lavalink.jar. Java v13 is recommended. If you are using sdkman then its a manager, not Java, you have to install sdkman and use sdkman to install Java

Warning: Java v14 has issues with Lavalink.

### 🌐 Main

- Discord bot's
  token `You should know why you need this or you won't go to this repo` [Get or create bot here](https://discord.com/developers/applications)
- Mongodb
  URI `for custom prefix` [MongoDB](https://account.mongodb.com/account/login)
- Your ID `for eval command. It's dangerous if eval accessible to everyone`
- Spotify client ID `for spotify support` [Click here to get](https://developer.spotify.com/dashboard/login)
- Spotify client Secret `for spotify support` [Click here to get](https://developer.spotify.com/dashboard/login)
- Ksoft API
  Key [Click here to get](https://api.ksoft.si/?ref=ksoft.si#get-started)

## 🎶 Available music sources:

- youtube`*`
- bandcamp`*`
- soundcloud`*`
- twitch`*`
- vimeo`*`
- http (you can use radio for it)`*`
- spotify`*`
- deezer`*`


<!-- INSTALL -->
## 🚀 Installation
```
git clone https://github.com/brblacky/lavamusic.git
```
After cloning, run an
```
npm install
```
* Start the bot with `node index.js`

to snag all of the dependencies. Of course, you need [node](https://nodejs.org/en/) installed. I also strongly recommend [nodemon](https://www.npmjs.com/package/nodemon) as it makes testing *much* easier.
<!-- CONFIGURATION -->

## ⚙️ Configurations

     "TOKEN": "", //Discord bot token 
     "MONGOURL": "",  //MongoDb url
     "KSOFT_API_KEY": "",  //ksoft api
     "PREFIX": "!",  //Default prefix
     "OWNERID": "491577179495333903",  //Owner id
     "SpotifyID": "",  //spotify client ID
     "SpotifySecret": "", //spotify client secret
     "embedColor": "",  //default embed color
    
## 🌋 lavalink 

      "host": "disbotlistlavalink.ml",
      "port": 443,
      "password": "LAVA",
      "retryDelay": 3000,
      "secure": true

- Create an application.yml file in your working directory and copy the [example](https://github.com/freyacodes/Lavalink/blob/master/LavalinkServer/application.yml.example) into the created file and edit it with your configuration.
- Run the jar file by running `java -jar Lavalink.jar` in a Terminal window.


<!-- ABOUT THE PROJECT -->

## 🌀 About
[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=brblacky&repo=lavamusic&theme=tokyonight)](https://github.com/brblacky/lavamusic)

 Lavamusic is a lavalink music bot base in [erela.js](https://github.com/MenuDocs/erela.js)
If you liked this repository, feel free to leave a star ⭐ to help promote !

## 💌 Support Server
[![DiscordBanner](https://invidget.switchblade.xyz/gfcv94hDhv)](https://discord.gg/gfcv94hDhv)
[Support Server](https://discord.gg/gfcv94hDhv) - lavamusic's Support Server Invite


<!-- LICENSE -->

## 🔐 License

Distributed under the MIT License. See [`LICENSE`](https://github.com/brblacky/lavamusic/blob/master/LICENSE) for more information.

[version-shield]: https://img.shields.io/github/package-json/v/brblacky/lavamusic?style=for-the-badge
[version-url]: https://github.com/brblacky/lavamusic
[contributors-shield]: https://img.shields.io/github/contributors/brblacky/lavamusic.svg?style=for-the-badge
[contributors-url]: https://github.com/brblacky/lavamusic/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/brblacky/lavamusic.svg?style=for-the-badge
[forks-url]: https://github.com/brblacky/lavamusic/network/members
[stars-shield]: https://img.shields.io/github/stars/brblacky/lavamusic.svg?style=for-the-badge
[stars-url]: https://github.com/brblacky/lavamusic/stargazers
[issues-shield]: https://img.shields.io/github/issues/brblacky/lavamusic.svg?style=for-the-badge
[issues-url]: https://github.com/brblacky/lavamusic/issues
[license-shield]: https://img.shields.io/github/license/brblacky/lavamusic.svg?style=for-the-badge
[license-url]: https://github.com/brblacky/lavamusic/blob/master/LICENSE
