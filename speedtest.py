# Responsible for testing speed
import io
import requests
import sys
import time
import os
import pycountry


def code_to_country(code):
    return pycountry.countries.get(alpha_2=code).name


def speed_test(links, ostm, archi):
    while True:
        os.system('clear')
        country_code = list(links.keys())
        for i in range(len(country_code)):
            print(
                f"{i + 1}: {code_to_country(country_code[i])}({len(links[country_code[i]])} {'mirrors' if len(links[country_code[i]]) > 1 else 'mirror'})")
        print("all: for test all mirror")
        country_code_number = input("\nEnter number separated by comma(enter q to quit): ")
        if country_code_number == 'q' or country_code_number == 'Q':
            print("Bye Bye")
            return None
        if country_code_number == 'all':
            country_code_number = list(range(len(country_code)))
        else:
            country_code_number = list(country_code_number.split(','))
        if len(country_code_number) == 0:
            continue
        break
    print('\nStarting speedtest...\n')
    for ccn in country_code_number:
        print('\n')
        print(
            f"\nChecking {code_to_country(country_code[int(ccn) - 1])} mirrors: {links[country_code[int(ccn) - 1]]}\n")
        filtered_links = links[country_code[int(ccn) - 1]]
        for link in filtered_links:
            url = f"{link}/releases/{ostm}/Everything/{archi}/os/images/efiboot.img"

            with io.BytesIO() as f:
                start = time.perf_counter()  # starting time
                r = requests.get(url, stream=True)  # making requestL
                total_length = r.headers.get('content-length')  # file size
                dl = 0
                if total_length is None:  # no content length header
                    f.write(r.content)  # data in hexadecimal
                else:
                    for chunk in r.iter_content(1024):  # r.iter_content() is iterating over receiving data
                        dl += len(chunk)
                        f.write(chunk)
                        done = int(30 * dl / int(total_length))
                        sys.stdout.write(
                            f"\r{link} [%s%s] %s Kbps" % (
                                '=' * done, ' ' * (30 - done), dl // (time.perf_counter() - start) / 1000))

            speed = dl // (time.perf_counter() - start) / 100000
            print('\n')
            if speed == 0.0:
                filtered_links.append(f"{link}/linux")