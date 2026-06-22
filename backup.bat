@echo off
:: ============================================================================
:: TRABAJO PRÁCTICO INTEGRADOR - UTN
:: SCRIPT DE RESPALDO AUTOMÁTICO (WINDOWS BATCH)
:: ============================================================================

:: 1. CAPTURAR LA FECHA ACTUAL (Formato seguro para carpetas: AAAA-MM-DD)
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set FECHA=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%

:: 2. DEFINIR LAS RUTAS RELATIVAS PARA LA CARPETA DE DESTINO
set CARPETA_RAIZ=.\resguardos_tpi
set CARPETA_BACKUP=%CARPETA_RAIZ%\%FECHA%

echo =======================================================
echo     INICIANDO PROCESO DE RESPALDO AUTOMATIZADO
echo =======================================================
echo Fecha actual: %FECHA%
echo Ruta de destino: %CARPETA_BACKUP%
echo.

:: 3. CREAR LAS CARPETAS SI NO EXISTEN
if not exist "%CARPETA_BACKUP%" (
    echo [INFO] Creando estructura de directorios...
    mkdir "%CARPETA_BACKUP%"
)

:: 4. CARGAR VARIABLES DESDE EL ARCHIVO .ENV AUTOMÁTICAMENTE
if exist ".\.env" (
    echo [INFO] Cargando configuraciones de seguridad desde .env...
    for /f "usebackq tokens=1,2 delims==" %%A in (".\.env") do (
        :: Ignora líneas vacías o comentarios que empiecen con #
        if not "%%A"=="" if not "%%A"~0,1=="#" (
            set %%A=%%B
        )
    )
) else (
    echo [ALERTA] No se encontro el archivo .env en la raiz del proyecto.
    pause
    exit /b
)

:: 5. EJECUTAR MONGODUMP GLOBAL USANDO LAS VARIABLES LEÍDAS DEL .ENV
echo [PROCESO] Conectando a MongoDB Atlas y extrayendo datos...
echo.

mongodump --uri="mongodb+srv://%MONGO_USER%:%MONGO_PASS%@%MONGO_CLUSTER%/%MONGO_DB_NAME%" --out="%CARPETA_BACKUP%"

:: 6. VERIFICAR SI LA OPERACIÓN FUE EXITOSA
if %ERRORLEVEL% EQU 0 (
    echo.
    echo =======================================================
    echo   [OK] !RESPALDO FISICO COMPLETADO CON EXITO!
    echo =======================================================
) else (
    echo.
    echo [ERROR] Hubo un problema al conectar o descargar el backup.
)