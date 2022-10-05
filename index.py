import system_info

print("Hello, welcome to Reflector for Fedora")
print("Auto selecting your Fedora version & architecture...")

print(system_info.os())
print(system_info.architecture())
