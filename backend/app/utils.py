from datetime import datetime

def format_ts(ms):
    return datetime.utcfromtimestamp(ms / 1000).strftime('%Y-%m-%d %H:%M:%S UTC')
