# Comment construire le et utilisé le projet ?
**⚠️ IMPORTANT : Ce projet est destiné à l'utilisation sur des ordinnateurs Unowhy, il doit être utilisé dans un Environement Windows PE et construit dans un environement Windows 10/11**
## Première étape : Construire l'application electron
### Prérequis
- `Node.JS@v16.14.2`
- `Windows ADK`
- `WinPE Addon pour Windows ADK`

#### Cloner le repo :
```bash
git clone https://github.com/nordmyra/Unowhy-Breaker/
```
#### Construire l'application electron
```
cd Unowhy-Breaker
npm install
npm run buildW
```
#### Mise en place de WinPE
**⚠️ IMPORTANT : Assurez-vous d'avoir bien lancé « Environnement de déploiement et d’outils de création d’images » pour exécuter les commandes suivantes**
```bash
copype amd64 "<chemin que vous avez choisi pour winpe>" # à exécuter uniquement lors de la première mise en place
dism /Mount-Image /ImageFile:"<chemin que vous avez choisi pour winpe>\media\sources\boot.wim" /Index:1 /MountDir:"<chemin que vous avez choisi pour winpe>\mount"
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
xcopy "<chemin d'accès vers le dossier du repo cloner>\dist\win-unpacked" "<chemin que vous avez choisi pour winpe>\mount\Program Files\Unowhy Breaker" /E /H /C /I
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