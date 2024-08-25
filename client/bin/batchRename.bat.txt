@echo off
setlocal enabledelayedexpansion

set "folderPath=."

cd "%folderPath%"

set "counter=1"

for %%F in (*.mp4) do (
    ren "%%F" !counter!.mp4
    set /a "counter+=1"
)

echo Renaming complete.

endlocal
