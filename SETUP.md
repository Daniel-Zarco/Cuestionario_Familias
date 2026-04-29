# Configurar Google Sheets para recibir respuestas

¡Es súper fácil! Sigue estos pasos para conectar el formulario a un Google Sheets. No te llevará más de 3 minutos.

## Paso 1: Crear la hoja de cálculo
1. Ve a [Google Sheets](https://sheets.google.com) e inicia sesión con una cuenta de Google.
2. Crea una hoja de cálculo **En blanco**.
3. Ponle un nombre arriba a la izquierda, por ejemplo: *"Cuestionario Familias"*.

## Paso 2: Añadir el código (Apps Script)
1. En el menú de arriba, haz clic en **Extensiones** > **Apps Script**.
2. Se abrirá una nueva pestaña. Verás que hay un código que pone `function myFunction() { ... }`.
3. **Borra** todo ese código.
4. Abre el archivo `apps_script.gs` que hay en esta carpeta (`C:\Users\Dani\Documents\Albita_Cuestionario\apps_script.gs`), copia todo su contenido y **pégalo** en la ventana de Apps Script.
5. Haz clic en el icono del **disquete** 💾 (arriba, donde dice "Guardar proyecto").

## Paso 3: Publicar como Aplicación Web (¡Muy importante!)
Para que tu formulario web pueda enviar datos a esta hoja, tienes que publicarlo:
1. Arriba a la derecha, haz clic en el botón azul **Implementar** (Deploy) > **Nueva implementación** (New deployment).
2. En la ventana que sale, haz clic en el icono de la **rueda dentada** ⚙️ (Seleccionar tipo) y elige **Aplicación web** (Web app).
3. Rellena los datos así:
   - *Descripción*: (Déjalo en blanco)
   - *Ejecutar como*: **Tú** (tu correo)
   - *Quién tiene acceso*: Selecciona **Cualquier persona** (Anyone). *(Si no seleccionas esto, el formulario dará error porque los padres no tendrán permiso).*
4. Haz clic en **Implementar**.
5. Te pedirá **Autorizar acceso**. Haz clic en "Autorizar", elige tu cuenta de Google. 
   - *Nota: Google te dirá "Google no ha verificado esta aplicación". No pasa nada, es tuya. Haz clic en "Configuración avanzada" (Advanced) abajo a la izquierda y luego en "Ir a Proyecto sin título (inseguro)". Por último, dale a "Permitir".*
6. Te saldrá una ventana confirmando que se ha implementado y te dará una **URL de la aplicación web**. 
7. **Copia esa URL**.

## Paso 4: Pegar la URL en tu formulario
1. Abre el archivo `script.js` de tu proyecto.
2. Arriba del todo (línea 11 aprox), busca donde dice `var APPS_SCRIPT_URL = 'TU_URL_AQUI';`.
3. Borra `TU_URL_AQUI` y pega ahí la URL que copiaste en el paso anterior. (Asegúrate de que quede entre comillas simples, así: `'https://script.google.com/macros/s/.../exec'`).
4. **Guarda** el archivo `script.js`.

¡Y YA ESTÁ! 🎉
Haz una prueba rellenando el formulario en tu navegador. Si vas al Google Sheets, verás que se ha creado una pestaña llamada "Respuestas" y tu prueba habrá aparecido por arte de magia.
