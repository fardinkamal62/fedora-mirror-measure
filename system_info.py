# Responsible for getting system information
import re
import subprocess


def sys_info():
    version = input("Enter Fedora version(Leave blank for auto select): ")
    archi = input("Enter architecture(aarch64, armhfp, ppc64le, s390x, x86_64)(Leave blank for auto select): ")
    if version == '':
        version = os()
    if archi == '':
        archi = architecture()
    return {'version': version, 'architecture': archi}


def hostnamectl(x):
    # command to execute
    cmd = f"hostnamectl | grep '{x}'"

    # storing the stdout
    temp = subprocess.Popen([cmd], shell=True, universal_newlines=True, stdout=subprocess.PIPE)

    # get the output as a string
    output = str(temp.communicate()[0]).strip()
    return output


def architecture():
    archi = hostnamectl('Architecture')
    result = re.sub("Architecture:", "", archi)
    result = re.sub("-", "_", result).split()[0]
    return result  # result = x86_64 // string


def os():
    operating_system = hostnamectl('Operating System')
    if re.search(r"^Fedora [1-9]+", operating_system):
        print("Fedora Linux not found")
        return None
    result = re.findall("\d+", operating_system)[0]
    return int(result)  # result = 36 // int
