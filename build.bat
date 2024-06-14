@echo off
setlocal
echo  _   __      ____                 _   _  __              ____        _ _     _           
echo ^|  \/  ^|_ __^| __ ^)  ___  __ _ ___^| ^|_^(_^)/ _^|_   _       ^| __ ^) _   _^(_^) ^| __^| ^| ___ _ __ 
echo ^| ^|\/^| ^| '__^|  _ \ / _ \/ _` / __^| __^| ^| ^|_^| ^| ^| ^|      ^|  _ \^| ^| ^| ^| ^| ^|/ _` ^|/ _ \ '__^|
echo ^| ^|  ^| ^| ^|  ^| ^|_^) ^|  __/ ^(_^| \__ \ ^|_^| ^|  _^| ^|_^| ^|      ^| ^|_^) ^| ^|_^| ^| ^| ^| ^(_^| ^|  __/ ^|   
echo ^|_^|  ^|_^|_^|  ^|____/ \___^|\__,_^|___/\__^|_^|_^|  \__, ^|      ^|____/ \__,_^|_^|_^|\__,_^|\___^|_^|   
echo                                             ^|___/                                        

:: Define variables
set ZIP_NAME_FIREFOX=Firefox.zip
set ZIP_NAME_CHROMIUM=Chromium.zip
set SOURCE_FOLDER=%CD%
set TEMP_FOLDER=%SOURCE_FOLDER%\temp
set SEVEN_ZIP_PATH="C:\Program Files\7-Zip\7z.exe"

:: Check if 7-Zip is installed
if not exist %SEVEN_ZIP_PATH% (
    echo WARNING: 7-Zip is not installed. Please install 7-Zip to use this script.
    echo I wish I could use Windows' built in Compress-Archive feature, but that is completely busted for some reason.
    pause
    exit /b
)

:: Ensure the temp folder is clean
if exist "%TEMP_FOLDER%" rmdir /s /q "%TEMP_FOLDER%"
mkdir "%TEMP_FOLDER%"

:: Copy files and folders individually to avoid cyclic copy
echo Copying files to the temp directory...
xcopy "%SOURCE_FOLDER%\manifest.json" "%TEMP_FOLDER%" /Q
xcopy "%SOURCE_FOLDER%\mrbeastify.js" "%TEMP_FOLDER%" /Q
xcopy "%SOURCE_FOLDER%\images" "%TEMP_FOLDER%\images\" /E /Q
xcopy "%SOURCE_FOLDER%\icon.png" "%TEMP_FOLDER%"/Q
xcopy "%SOURCE_FOLDER%\settings.html" "%TEMP_FOLDER%"/Q
xcopy "%SOURCE_FOLDER%\settings.js" "%TEMP_FOLDER%"/Q


:: Create Firefox zip folder using 7-Zip
echo Creating Firefox zip folder...
%SEVEN_ZIP_PATH% a -tzip "%SOURCE_FOLDER%\%ZIP_NAME_FIREFOX%" "%TEMP_FOLDER%\*" -bso0 -bsp0
echo Firefox zip folder created successfully.

:: Ensure the temp folder is clean
if exist "%TEMP_FOLDER%" rmdir /s /q "%TEMP_FOLDER%"
mkdir "%TEMP_FOLDER%"

:: Copy files and folders for Chromium
xcopy "%SOURCE_FOLDER%\mrbeastify.js" "%TEMP_FOLDER%" /Q
xcopy "%SOURCE_FOLDER%\manifest v3.json" "%TEMP_FOLDER%" /Q
xcopy "%SOURCE_FOLDER%\images" "%TEMP_FOLDER%\images\" /E /Q
xcopy "%SOURCE_FOLDER%\icon.png" "%TEMP_FOLDER%"/Q
xcopy "%SOURCE_FOLDER%\settings.html" "%TEMP_FOLDER%"/Q
xcopy "%SOURCE_FOLDER%\settings.js" "%TEMP_FOLDER%"/Q

:: Rename manifest for Chromium
echo Preparing files for Chromium zip...
rename "%TEMP_FOLDER%\manifest v3.json" "manifest.json"

:: Create Chromium zip folder using 7-Zip
echo Creating Chromium zip folder...
%SEVEN_ZIP_PATH% a -tzip "%SOURCE_FOLDER%\%ZIP_NAME_CHROMIUM%" "%TEMP_FOLDER%\*" -bso0 -bsp0
echo Chromium zip folder created successfully.

:: Cleanup
if exist "%TEMP_FOLDER%" rmdir /s /q "%TEMP_FOLDER%"

echo All operations completed successfully.
pause
