tmux new-session -d -n "Bracer-AlgorithmAPI" gunicorn3 -w 4 -b 127.0.0.1:5001 --timeout 120 --chdir /home/wcs/Bracer/Bracer-Algorithm/Bracer-Algorithm handlerapi:app
