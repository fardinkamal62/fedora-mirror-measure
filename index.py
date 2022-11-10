import os

import system_info
import scrape
import speedtest

name = "Fedora MiMe"
version = '0.0.2'

os.system('clear')
print(f"{name}")
print(f"Version: {version}\n")

info = system_info.sys_info()

os = info['version']
archi = info['architecture']

print(f"Found Operating System: Fedora {os}")
print(f"Found Architecture: {archi}\n")
print("Getting mirror list....\n")

mirrors = scrape.mirror(f"https://admin.fedoraproject.org/mirrormanager/mirrors/Fedora/{os}/{archi}")

speedtest.speed_test(mirrors, os, archi)
print(f"Thank you for using {name}")
