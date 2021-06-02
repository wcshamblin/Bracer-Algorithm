tmux new-session -d -n "Bracer_AlgorithmAPI" gunicorn3 -w 4 -b 127.0.0.1:5001 --chdir /home/mcserver/Bracer/Bracer_Algorithm/ handlerapi:app
