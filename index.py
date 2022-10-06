import os
import time

import system_info
import scrape
import speedtest

os.system('clear')
print("Fedora Mirror Selector\n")
print("Auto selecting your Fedora version & architecture...")

os = system_info.os()
archi = system_info.architecture()

print(f"Found Operating System: Fedora {os}")
print(f"Found Architecture: {archi}\n")
print("Getting mirror list....\n")

mirrors = scrape.scrape(f"https://admin.fedoraproject.org/mirrormanager/mirrors/Fedora/{os}/{archi}")

print('Mirrors fetched\nStarting speedtest...')
time.sleep(3)

speedtest.speed_test(mirrors, os, archi)
