def color(string,f,b):
    return f"\033[3{f};4{b}m{string}\033[0m"

# 0 = black
# 1 = red
# 2 = greed
# 3 = yellow
# 4 = blue
# 5 = purple
# 6 = cyan
# 7 = grey
# 9 = terminal's default foreground or background color
