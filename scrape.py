# Import necessary libraries
import requests
from bs4 import BeautifulSoup, SoupStrainer
import re

# Define regular expression patterns for filtering links
regexes = {
    'capital_letter': r'^[A-Z]{2}$',  # Matches country codes (e.g. US, DE, FR)
    'fedora_keyword': r'^https?:\/\/.*\/fedora(?!-)',  # Matches links containing the word "fedora"
    'epel_keyword': r'^https?:\/\/.*epel.*'  # Matches links containing the word "epel"
}

# Initialize empty dictionary to store mirror links
mirrors = {}

def fetch_mirrors(url):
    """Fetches mirror links from a given URL and returns a dictionary of country codes and their respective mirror links.
    
    Args:
        url (str): The URL to fetch the mirror links from.
    
    Returns:
        dict: A dictionary of country codes and their respective mirror links.
    """

    # Fetch page content using requests library
    page = requests.get(url)
    # Parse page content using BeautifulSoup library, parsing only <td> tags for efficiency
    soup = BeautifulSoup(page.content, "html.parser", parse_only=SoupStrainer('td'))

    # Initialize empty string to store the current country code being processed
    country_code = ''
    # Loop through all the <a> tags in the page
    for link in soup.find_all('a'):
        # Get the 'href' attribute of the link
        href = link.get('href')
        # If 'href' attribute exists
        if href:
            # If the link matches the fedora keyword pattern and doesn't match the epel keyword pattern
            if re.match(regexes['fedora_keyword'], href) and not re.match(regexes['epel_keyword'], href):
                # If a country code has been found previously, append the link to the respective list in the mirrors dictionary
                if country_code:
                    mirrors[country_code].append(href)
            # If the link matches the country code pattern
            elif re.match(regexes['capital_letter'], link.text):
                # Set the current country code to the text of the link
                country_code = link.text
                # Initialize an empty list for the current country code in the mirrors dictionary
                mirrors[country_code] = []

    # Return the mirrors dictionary
    return mirrors
