def read_log_file(file_path):
    """Read the content of a log file."""
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()
