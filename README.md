<div align="center">
<!-- Title: -->
  <h1><a href="https://github.com/fardinkamal62/fedora-mirror-measure">Fedora MiMe</a></h1>
<!-- Short description: -->
  <h3>A Python script to measure Fedora mirror speed</h3>
    <h6>version: 2.0.0</h6>
</div>

<br>

I love Fedora. My only complain was slow mirror speed.  

Ubuntu has Software Center, Arch has Reflector but Fedora didn't have anything. Until now...  

#### Introducing Fedora MiMe, a Python script to measure Fedora mirror speed

## Getting Started

---

**Install packages**: `pip3 install -r requirements.txt`  

**Run MiMe**: `python3 index.py`

## Why not fastestmirror=1?

---

> fastestmirror is based on a faulty concept, when it's turned on your dnf pings all the servers in the list it has and takes the fastest ping time as the "fastestmirror" and it goes to that one as the server

Source: https://forums.fedoraforum.org/showthread.php?328191-Enable-Fastest-Mirror

In my personal experience used to get speed around **500 Kbps** with fastestmirror enabled.  
After using MiMe I get around **2 Mbps!**  


## Changelog

---

### 2.0.0:

- Scraping improvement
- Get mirrors by country
- Measure mirror speed by country-wise
- Measure speed in Kbps
- Get all the measured mirrors with speed

### 1.0.0 (base):

- Get all mirror
- Measure speed