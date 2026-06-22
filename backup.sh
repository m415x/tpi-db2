#!/bin/bash
# ============================================================================
# TRABAJO PRÁCTICO INTEGRADOR - UTN
# SCRIPT DE RESPALDO AUTOMÁTICO (LINUX / MAC SHELL)
# ============================================================================

# 1. CAPTURAR LA FECHA ACTUAL (Formato seguro para carpetas: AAAA-MM-DD)
FECHA=$(date +%Y-%m-%d)

# 2. DEFINIR LAS RUTAS RELATIVAS PARA LA CARPETA DE DESTINO
CARPETA_RAIZ="./resguardos_tpi"
CARPETA_BACKUP="$CARPETA_RAIZ/$FECHA"

echo "======================================================="
echo "    INICIANDO PROCESO DE RESPALDO AUTOMATIZADO"
echo "======================================================="
echo "Fecha actual: $FECHA"
echo "Ruta de destino: $CARPETA_BACKUP"
echo ""

# 3. CREAR LAS CARPETAS SI NO EXISTEN (-p crea la ruta completa sin fallar)
if [ ! -d "$CARPETA_BACKUP" ]; then
    echo "[INFO] Creando estructura de directorios..."
    mkdir -p "$CARPETA_BACKUP"
fi

# 4. CARGAR VARIABLES DESDE EL ARCHIVO .ENV AUTOMÁTICAMENTE
if [ -f "./.env" ]; then
    echo "[INFO] Cargando configuraciones de seguridad desde .env..."
    # Exporta las variables del .env filtrando comentarios
    export $(grep -v '^#' ./.env | xargs)
else
    echo "[ERROR] No se encontro el archivo .env en la raiz del proyecto."
    exit 1
fi

# 5. EJECUTAR MONGODUMP GLOBAL
echo "[PROCESO] Conectando a MongoDB Atlas y extrayendo datos..."
echo ""

mongodump --uri="mongodb+srv://$MONGO_USER:$MONGO_PASS@$MONGO_CLUSTER/$MONGO_DB_NAME" --out="$CARPETA_BACKUP"

# 6. VERIFICAR SI LA OPERACIÓN FUE EXITOSA ($? guarda el resultado del ultimo comando)
if [ $? -eq 0 ]; then
    echo ""
    echo "======================================================="
    echo "  [OK] ¡RESPALDO FISICO COMPLETADO CON EXITO!"
    echo "======================================================="
else
    echo ""
    echo "[ERROR] Hubo un problema al conectar o descargar el backup desde Atlas."
    exit 1
fi