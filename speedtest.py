try:
    import io
    import requests
    import sys
    import time
    import os
except ImportError:
    print("Need to install module \'requests\'")


def speed_test(links, ostm, archi):
    os.system('clear')
    print(f"Mirror found {len(links)}")
    for link in links:
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
                        f"\r{link} [%s%s] %s Mbps" % (
                            '=' * done, ' ' * (30 - done), dl // (time.perf_counter() - start) / 100000))

        speed = dl // (time.perf_counter() - start) / 100000
        if speed == 0.0:
            print(f"{link} Unreachable")
