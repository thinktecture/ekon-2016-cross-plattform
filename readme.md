# EKON 20 - November 2016

This is a sample demo application for demonstrating how you could build modern cross-platform applications - with node.js, TypeScript, Angular2, Cordova, and Electron.

##Voraussetzungen
* Node: https://nodejs.org/en/
* ImageMagick: http://www.imagemagick.org/ (Zur Erstellung der verschiedenen Icons)
* Delphi

## Project structure

* _build_: Enthält nach dem Build alle Dateien des Clients
* _dist_: Enthält alle Cordova- und Electron-Projekte
* _DelphiServer_: Enthält den Delphi-Serveranteil der Anwendung
* _client_: Demo-Applikation mit Angular 2 - unterstützt das Erstellen von Cordova- und Electron-Projekten

## Setup Instructions

Um das Setup für die Demo-Applikation zu starten den Befehl `npm install` im Ordner `client` ausführen.

Um die API zu starten im Root-Ordner das Projekt `EKON20.groupproj` öffnen und starten. Die API ist nun über den Port `8000` erreichbar.

Um die Angular 2 Anwendung zu starten muss der Befehl `npm start` im Ordner `client` ausgeführt werden. Damit wird unter anderem ein Web-Server `http://localhost:8080/` gestartet.

Damit API und Client miteinander kommunizieren können muss die API-Url in der Datei `client/src/app/services/quoteService.ts` angepasst werden: `this._apiUrl = 'http://ip-der-api:8000';`

## Client Build Tasks

### Desktop Build Tasks

Die verschiedenen Electron-Projekte können mit folgenden Befehlen erstellt werden. Die Befehle müssem im Ordner `client` ausgeführt werden.

 - `npm run build-macos`
 - `npm run build-linux`
 - `npm run build-windows`
 - `npm run build-desktop`

### Mobile Build Tasks

Die verschiedenen Cordova-Projekte können mit folgenden Befehlen erstellt werden. Die Befehle müssen im Ordner `client` ausgeführt werden.

 - `npm run build-ios`
 - `npm run build-android`
 - `npm run build-uwp`
 - `npm run build-mobile`

_Das Cordova-Projekt für iOS kann nur unter macOS erstellt werden._