# Comment construire le et utilisé le projet ?
**⚠️ IMPORTANT : Ce projet est destiné à l'utilisation sur des ordinnateurs Unowhy, il doit être utilisé dans un Environnement Windows PE et construit dans un environnement Windows 10/11**
## Première étape : Construire les application electron
En effet, dans cette version il est necessaire de construire deux versions de l'application, la première étant l'installer, qui lui se lance toujours dans un environnement Windows PE, l'autre, l'application en elle même, sera installer sur le système destinataire par l'intermédiaire de l'installer
### Prérequis
- `Node.JS@v16.14.2`
- `Windows ADK`
- `WinPE Addon pour Windows ADK`

#### Cloner les repos :
```bash
git clone -b installer https://github.com/nordmyra/Unowhy-Breaker/ Unowhy-Breaker-Breaker
git clone -b stable https://github.com/nordmyra/Unowhy-Breaker/ Unowhy-Breaker-App
```
#### Construire l'application electron
```bash
cd Unowhy-Breaker-App
npm install
npm run buildW
cd ..
cd Unowhy-Breaker-Installer
npm install
xcopy ../Unowhy-Breaker-App/dist/win-unpacked/* "./bin/Unowhy Breaker"  /E /H /C /I
```
#### Mise en place de WinPE
**⚠️ IMPORTANT : Assurez-vous d'avoir bien lancé « Environnement de déploiement et d’outils de création d’images » pour exécuter les commandes suivantes**
```bash
copype amd64 "<chemin que vous avez choisi pour winpe>" # à exécuter uniquement lors de la première mise en place
dism /Mount-Image /ImageFile:"<chemin que vous avez choisi pour winpe>\media\sources\boot.wim" /Index:1 /MountDir:"<chemin que vous avez choisi pour winpe>\mount"
rmdir /s /q "<chemin que vous avez choisi pour winpe>mount\Program Files\Unowhy Breaker" # à exécuter lors de toutes les mises places suivants la première
```
#### Mise en place des fichiers
##### Copie des DLL requis (à exécuter uniquement lors de la première mise en place)
```bash
xcopy "C:\Windows\System32\BCP47Langs.dll" "<chemin que vous avez choisi pour winpe>\mount\BCP47Langs.dll"
xcopy "C:\Windows\System32\d3d9.dll" "<chemin que vous avez choisi pour winpe>\mount\d3d9.dll"
xcopy "C:\Windows\System32\d3d11.dll" "<chemin que vous avez choisi pour winpe>\mount\d3d11.dll"
xcopy "C:\Windows\System32\dxgi.dll" "<chemin que vous avez choisi pour winpe>\mount\dxgi.dll"
xcopy "C:\Windows\System32\dxva2.dll" "<chemin que vous avez choisi pour winpe>\mount\dxva2.dll"
xcopy "C:\Windows\System32\msdmo.dll" "<chemin que vous avez choisi pour winpe>\mount\msdmo.dll"
```
##### Copie des fichiers de l'application
```bash
xcopy "<chemin d'accès vers le dossier du repo cloner la branche installer>\dist\win-unpacked" "<chemin que vous avez choisi pour winpe>\mount\Program Files\Unowhy Breaker" /E /H /C /I
dism /Unmount-Image /MountDir:"<chemin que vous avez choisi pour winpe>\mount /Commit"
```
#### Construction de WinPE
```bash
# Vous pouvez au choix, flasher WinPE sur votre disque amovible comme ceci
MakeWinPEMedia /UFD "<chemin que vous avez choisi pour winpe>" "<lettre associé à votre lecteur (Ex D:) >"
# Ou bien vous pouvez créer un fichier ISO
MakeWinPEMedia /ISO "<chemin que vous avez choisi pour winpe>" "<chemin que vous avez choisi pour l'iso de winpe>"
```

#### Nettoyage de WinPE
```bash
dism /cleanup-wim
```