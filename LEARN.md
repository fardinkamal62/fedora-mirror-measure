# Hello humble learner👋
 Let me tell you how I made this script.

### Flow of the script:

**index.py** -> **system_info.py** -> **scrape.py** -> **speedtest.py**


### Description of the files


**index.py** is the entrypoint. Here I'm importing all the
dependent files, displaying brand name & version

**system_info.py** fetches system info such as Fedora version & architecture by 
running the command `hostnamectl` with `grep` and gives the data back to **index.py**
- If the system is not Fedora, it will autoselect Fedora 36
  - If the system is Fedora but version not specified, it will fetch the version from `hostnamectl` command 

**scrape.py** used for scraping mirror list from Fedora mirror manager using `beautifulsoup4`. After fetching system info **index.py** calls this file 
1. From Fedora version & architecture it fetches HTML of mirror manager e.g. `https://admin.fedoraproject.org/mirrormanager/mirrors/Fedora/38/x86_64`
2. From that it filters out all the `<td>` as they contain country name & mirror address
3. From them it traverse through all of them
   - If it finds two capital letters e.g. `AU`, it saves in a variable
     - If it finds URL: filters for Fedora mirrors & removes Fedora EPEL & others
   - Saves filtered urls into dictionary with country code as key e.g. `{AU:[mirror1_URL, mirror2_URL]}`
4. After all the country is fetched, sends the data back to **index.py**

**speedtest.py** file responsible for measuring speed of each mirror by downloading a small file
1. First it checks if the version is `development` or `release` version with a simple `request` script. According to that it downloads different files
2. After that from the mirror list it downloads `efiboot.img` file from each of the mirrors and displays the download speed.
