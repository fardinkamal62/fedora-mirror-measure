<div style="text-align: center; margin-top: 5%">
<img  src="./assets/mime-banner.png" style="width: 40%; height: auto; align-self: center" alt="banner">

#### Learn how MiMe works
</div>

## Pre-requisites

---

- Basic knowledge of HTML, CSS, JavaScript, JQuery
- Basic knowledge of Node.js & npm
- Ability to use Google & ChatGPT

## File Identification

---

``` electron.js ``` - Main file that runs the Electron app

``` index.html ``` - Main HTML file

``` renderer.js ``` - Main frontend JS file

``` index.css ``` - Main CSS file

``` preload.js ``` - Preload file for Electron app (that connects the main and renderer process AKA frontend and Electron)

``` package.json ``` - Package file for Electron app

``` assets ``` - Folder containing all assets (logo, banner, etc.)


## Process Flow

---

- Electron app starts. ``` electron.js ``` runs
- ``` index.html ``` is loaded along with ``` index.css ``` and ``` renderer.js ```
- ``` index.html ``` fetches Bootstrap, JQuery libraries from CDN
- ``` renderer.js ``` starts event listeners for buttons

If clicked on auto select configuration:

- ``` renderer.js ``` runs a function ``` sysinfo.arch() ``` to get architecture information
- `sysinfo.version()` is run to get Fedora version
- Both of them relies on Node.js ``` os ``` module

When desired Fedora version & architecture is selected:

- Then ``` renderer.js ``` calls `mirrorInfo.get()` to get the mirror list
- ``` renderer.js ``` displays the mirror list in the frontend

When speedtest is clicked:

- ``` renderer.js ``` calls `speedtest.checkRelease()` to check if Fedora version is `released` or `development`
- Then `renderer.js` passes all necessary data such as `mirror list`, `architecture`, `Fedora version` to `speedtest.main()` one by one
- And `speedtest.main()` returns the speedtest result

Stop button:

- When stop button is clicked, `speedtest.stop()` is called and it stops the speedtest
- `speedtest.stop()` sends a flag to `speedtest.main()` to stop the JS `fetch` API call
- In the `renderer.js` also a flag is set where `speedtest.main()` is calling to stop the speedtest

Lastly, when app closes:

- Speedtest cache is cleared
- In `electron.js` on `before-quit` event, it clears cache