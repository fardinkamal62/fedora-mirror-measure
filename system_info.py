import re
import subprocess


def hostnamectl(x):
    cmd = f"hostnamectl | grep '{x}'"   # command to execute

    temp = subprocess.Popen(            # storing in stodout
        [cmd], shell=True, universal_newlines=True, stdout=subprocess.PIPE)

    # get the output as a string
    output = str(temp.communicate()[0]).strip()
    return output


def architecture():
    archi = hostnamectl('Architecture')
    result = re.sub("Architecture:", "", archi)
    result = re.sub("-", "_", result).split()[0]
    return result       # result = x86_64


def os():
    os = hostnamectl('Operating System')
    result = re.findall("\d+", os)[0]
    return int(result)         # result = 36 // int

# archi = hostnamectl('Architecture')
# os = hostnamectl('Operating System')
# print(archi, os)
