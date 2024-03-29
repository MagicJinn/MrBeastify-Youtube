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

:: Ensure the temp folder is clean
if exist "%TEMP_FOLDER%" rmdir /s /q "%TEMP_FOLDER%"
mkdir "%TEMP_FOLDER%"

:: Copy files and folders individually to avoid cyclic copy
echo Copying files to the temp directory...
xcopy "%SOURCE_FOLDER%\mrbeastify.js" "%TEMP_FOLDER%" /Q
xcopy "%SOURCE_FOLDER%\manifest v3.json" "%TEMP_FOLDER%" /Q
xcopy "%SOURCE_FOLDER%\images" "%TEMP_FOLDER%\images\" /E /Q
xcopy "%SOURCE_FOLDER%\icons" "%TEMP_FOLDER%\icons\" /E /Q

echo Creating Firefox zip folder...
powershell Compress-Archive -Path "%SOURCE_FOLDER%\mrbeastify.js", "%SOURCE_FOLDER%\manifest.json", "%SOURCE_FOLDER%\images", "%SOURCE_FOLDER%\icons" -DestinationPath "%SOURCE_FOLDER%\%ZIP_NAME_FIREFOX%" -Force
echo Firefox zip folder created successfully.

:: Rename manifest for Chromium
echo Preparing files for Chromium zip...
rename "%TEMP_FOLDER%\manifest v3.json" "manifest.json"

echo Creating Chromium zip folder...
powershell Compress-Archive -Path "%TEMP_FOLDER%\mrbeastify.js", "%TEMP_FOLDER%\manifest.json", "%TEMP_FOLDER%\images", "%TEMP_FOLDER%\icons" -DestinationPath "%SOURCE_FOLDER%\%ZIP_NAME_CHROMIUM%" -Force
echo Chromium zip folder created successfully.

:: Cleanup
if exist "%TEMP_FOLDER%" rmdir /s /q "%TEMP_FOLDER%"

echo All operations completed successfully.
pause
