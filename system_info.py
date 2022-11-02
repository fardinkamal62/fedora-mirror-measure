import re
import subprocess
from TermColors import color


def hostnamectl(x):
    # command to execute
    cmd = f"hostnamectl | grep '{x}'"

    # storing the stdout
    try:
        temp = subprocess.Popen([cmd], shell=True, universal_newlines=True, stdout=subprocess.PIPE)
    except:
        print(color(f"\'hostnamectl\'command not found. It is possible that you do not have it installed or you are not using a Linux distribution right now.\033[0m", 1,9))
        exit()

    # get the output as a string
    output = str(temp.communicate()[0]).strip()
    return output


def architecture():
    archi = hostnamectl('Architecture')
    result = re.sub("Architecture:", "", archi)
    result = re.sub("-", "_", result).split()[0]
    return result  # result = x86_64 // string


def os():
    try:
        os = hostnamectl('Operating System')
        result = re.findall("\d+", os)[0]
    except IndexError:
        print(color("Sorry, could not find your distribution's version information.", 1,9))
        exit()
    return int(result)  # result = 36 // int
