import os
import time
from TermColors import color

import system_info
import scrape
import speedtest

os.system('clear')
print(color("Fedora Mirror Selector\n", 4, 9))
print(color("Auto selecting your Fedora version & architecture...", 3, 9))

os = system_info.os()
archi = system_info.architecture()

print(color(f"Found Operating System: \033[35mFedora {os}\033[0m", 2, 9))
print(color(f"Found Architecture: {color(archi, 5, 9)}\n", 2, 9))
print(color("Getting mirror list....\n", 3, 9))

mirrors = scrape.scrape(f"https://admin.fedoraproject.org/mirrormanager/mirrors/Fedora/{os}/{archi}")

print(color("Mirrors fetched\n", 2, 9))
print(color("Starting speedtest...", 3, 9))
time.sleep(3)

speedtest.speed_test(mirrors, os, archi)
