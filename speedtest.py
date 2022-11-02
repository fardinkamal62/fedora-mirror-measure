try:
    import io
    import requests
    import sys
    from TermColors import color
    import time
    import os
except ImportError:
    print(color("Need to install module \'requests\'", 2,9))


def speed_test(links, ostm, archi):
    try:
        os.system('clear')
        print(color(f"Mirror found {color(len(links), 5, 9)}", 2, 9))
        for link in links:
            url = f"{link}/releases/{ostm}/Everything/{archi}/os/images/efiboot.img"
            with io.BytesIO() as f:
                start = time.perf_counter()  # starting time
                try:
                    r = requests.get(url, stream=True)  # making requestL
                except OSError:
                    print(color(f"Network error at {link}.\nExiting...", 1, 9))
                    exit()
                total_length = r.headers.get('content-length')  # file size
                dl = 0
                if total_length is None:  # no content length header
                    f.write(r.content)  # data in hexadecimal
                else:
                    for chunk in r.iter_content(1024):  # r.iter_content() is iterating over receiving data
                        dl += len(chunk)
                        f.write(chunk)
                        done = int(30 * dl / int(total_length))
                        sys.stdout.write(f"\r{link} [%s%s] %s Mbps\n" % ('=' * done, ' ' * (30 - done), dl // (time.perf_counter() - start) / 100000))

            speed = dl // (time.perf_counter() - start) / 100000
            if speed == 0.0:
                print(color(f"{link} Unreachable", 1, 9))
    except KeyboardInterrupt:
        exit()
