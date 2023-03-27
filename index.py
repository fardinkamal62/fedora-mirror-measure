import os
import system_info
import scrape
import speedtest

# Define name and version of the tool
name = "Fedora MiMe"
version = '2.1.0'

# Clear the terminal screen and print the name and version of the tool
os.system('clear')
print(f"{name}")
print(f"Version: {version}\n")

# Get system information using the sys_info function from the system_info module
info = system_info.sys_info()

# Get the version and architecture of the Fedora operating system from the system information
os_version = info['version']
archi = info['architecture']

# Print the found operating system version and architecture
print(f"Found Operating System: Fedora {os_version}")
print(f"Found Architecture: {archi}\n")

# Get a list of Fedora mirrors using the mirror function from the scrape module
print("Getting mirror list....\n")
mirrors = scrape.fetch_mirrors(f"https://admin.fedoraproject.org/mirrormanager/mirrors/Fedora/{os_version}/{archi}")

# Run the speed test using the speed_test function from the speedtest module
speedtest.speed_test(mirrors, os_version, archi)

# Print a message thanking the user for using the tool
print(f"Thank you for using {name}")
