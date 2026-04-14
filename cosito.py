import json
import os

# Nombres de los archivos
archivo_entrada = 'estaciones.json'
archivo_salida = 'estacioneslimpias.json'

def limpiar_duplicados():
    if not os.path.exists(archivo_entrada):
        print(f">> EXCEPCIÓN: No se encontró el archivo '{archivo_entrada}'")
        return

    print(f"Leyendo '{archivo_entrada}'...")
    with open(archivo_entrada, 'r', encoding='utf-8') as f:
        estaciones = json.load(f)

    estaciones_unicas = []
    nombres_vistos = set()
    duplicados_eliminados = 0

    for estacion in estaciones:
        # Extraemos el nombre y lo normalizamos (minúsculas y sin espacios extra)
        # Esto asegura que "Aspen" y " aspen " se traten como la misma radio
        nombre_normalizado = estacion.get('name', '').strip().lower()

        if nombre_normalizado not in nombres_vistos:
            nombres_vistos.add(nombre_normalizado)
            estaciones_unicas.append(estacion)
        else:
            duplicados_eliminados += 1

    # Guardamos el resultado en un nuevo archivo
    with open(archivo_salida, 'w', encoding='utf-8') as f:
        # indent=4 lo formatea bonito y ensure_ascii=False respeta los acentos/tildes
        json.dump(estaciones_unicas, f, indent=4, ensure_ascii=False)

    # Imprimimos el reporte final para la consola
    print("\n[ REPORTE DE LIMPIEZA ]")
    print(f"  > Total original:       {len(estaciones)}")
    print(f"  > Duplicados borrados:  {duplicados_eliminados}")
    print(f"  > Total limpio:         {len(estaciones_unicas)}")
    print(f"\n>> ÉXITO: Archivo guardado como '{archivo_salida}'")

if __name__ == '__main__':
    limpiar_duplicados()