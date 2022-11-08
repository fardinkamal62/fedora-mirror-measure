# Responsible for fetching mirror list
import requests
from bs4 import BeautifulSoup, SoupStrainer
import re

regexes = {
    'capital_letter': r'^[A-Z]{2}$',
    'fedora_keyword': r'^http(|s):.*(\/fedora(?!-))',
    'epel_keyword': r'epel*',
}
mirrors = {}


def mirror(url):
    country_code = ''
    page = requests.get(url)  # Getting page HTML through request
    soup = BeautifulSoup(page.content, "html.parser", parse_only=SoupStrainer('td'))  # Parsing only <td>s

    for link in soup:  # Scraping through all the <td>
        if re.search(regexes['capital_letter'], link.text) is not None:
            country_code = link.text  # If country code found, save it on variable
        domain = link.select('a')  # Select 'href' from td
        if len(domain) > 0:  # 'domain' returns array
            for d in domain:
                if re.search(regexes['fedora_keyword'], d['href']) is not None:  # filtering for fedora keyword
                    if re.search(regexes['epel_keyword'], d['href']) is None:  # filtering epel repos
                        handle_dictionary(country_code, d['href'])
    return mirrors


def handle_dictionary(code, link):
    if code in mirrors:
        mirrors[code].append(link)
    else:
        mirrors[code] = []
