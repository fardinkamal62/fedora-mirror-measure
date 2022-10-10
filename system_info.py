import re
import subprocess


def hostnamectl(x):
    # command to execute
        cmd = f"hostnamectl | grep '{x}'"

    # storing the stdout
   try:
       temp = subprocess.Popen([cmd], shell=True, universal_newlines=True, stdout=subprocess.PIPE)
   except:
       print("\033[34m\'hostnamectl\'\033[31m command not found. It is possible that you do not have it installed or you are not using a Linux distribution right now.\033[0m")
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
        print("\033[31mSorry, could not find your distribution's version information.\033[0m")
        exit()
    return int(result)  # result = 36 // int
