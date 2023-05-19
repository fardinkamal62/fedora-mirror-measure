<div style="text-align: center; margin-top: 5%">
<img  src="./assets/mime-banner.png" style="width: 40%; height: auto; align-self: center" alt="banner">

#### Mirror Measure app for Fedora Linux
###### v3.0.0
</div>

<img src="https://fardinkamal62.github.io/assets/ss-1.png" alt="screenshot"/>
<img src="https://fardinkamal62.github.io/assets/ss-2.png" alt="screenshot"/>
<img src="https://fardinkamal62.github.io/assets/ss-3.png" alt="screenshot"/>


## About

---
A simple Electron app that will help you find Fedora mirrors & run speedtest

## Features

---

- Fetch mirror from provided Fedora version & architecture
- Speedtest
- Store mirror data offline
- Mirrors by country
- Selecting all mirrors or individual mirrors
- Night mode :3

## Tech Stack

---

- Electron
- HTML & CSS

## Installation

---

- Clone the repo
- Run `npm install` to install necessary dependencies
- Run `npm run electron:run` to run the Electron app
- To build: run `npm run build:linux` or `npm run build:windows` for Linux and Windows respectively


## About the old version

---

It'll be here forever on `legacy` branch. I love what I did. It was my first opensource contribution. I'm very proud of me that I was able to do it.

I'll still support it but I won't be adding any new features.



## Changelog

---
### 3.0.0:
- Added GUI 🎉


**Fixes**
- All the previous know issues are resolved


### 2.2.0:
- Fixed: download if file is not present
- Added: shows best mirror
- Autoselect Fedora 36 if run on distro other than Fedora

**Known Issues**
- Flags not rendering `speedtest.py:13:5`

### 2.1.0:
- Added support for Pre-Release
- Speedtest all the servers without typing **all**

**Known Issues**
- Flags not rendering `speedtest.py:13:5`

### 2.0.0:

- Scraping improvement
- Get mirrors by country
- Measure mirror speed by country-wise
- Measure speed in Kbps
- Get all the measured mirrors with speed

### 1.0.0 (base):

- Get all mirror
- Measure speed