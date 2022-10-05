import system_info
import scrape

print("Fedora Mirror Selector")
print("Auto selecting your Fedora version & architecture...\n")

os = system_info.os()
archi = system_info.architecture()

print(f"Found Operating System: Fedora {os}")
print(f"Found Architecture: {archi}\n")
print("Getting mirror list....\n")

mirrors = scrape.scrape(f"https://admin.fedoraproject.org/mirrormanager/mirrors/Fedora/{os}/{archi}")
