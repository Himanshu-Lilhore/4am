@echo off
REM --------------------------------------------
REM compress_videos.bat
REM Loop through all .mp4 files in the current directory
REM and compress each with libx265 at CRF 28.
REM Outputs are named compressed_<original>.mp4
REM --------------------------------------------

REM Check that ffmpeg is available
where /q ffmpeg
if errorlevel 1 (
    echo ERROR: ffmpeg.exe not found in PATH.
    echo Please install FFmpeg or add it to your PATH.
    pause
    exit /b 1
)

REM Process each .mp4 file
for %%F in (*.mp4) do (
    echo.
    echo Compressing "%%F" ...
    ffmpeg -i "%%F" -vcodec libx265 -crf 28 "compressed_%%~nF.mp4"
    if errorlevel 1 (
        echo ERROR compressing "%%F"
    ) else (
        echo Done: compressed_%%~nF.mp4
    )
)

echo.
echo All done!
pause
