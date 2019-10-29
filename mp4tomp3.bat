set $mp3=.mp3
set _filename=%~n1
ffmpeg -i %1 "%_filename%%$mp3%"
