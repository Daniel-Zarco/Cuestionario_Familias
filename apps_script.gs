// =========================================
//  GOOGLE APPS SCRIPT - Pegar en editor.gs
//  Guarda las respuestas del cuestionario
//  en la hoja de calculo activa
// =========================================

var SHEET_NAME = 'Respuestas'; // Nombre de la pestana donde se guardaran los datos

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    // Si la hoja no existe, crearla con cabeceras
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
      sheet.appendRow(['Fecha', 'Experiencia Previa', 'Comentario (opcional)', 'Expectativas del curso']);
      // Formatear cabeceras
      var header = sheet.getRange(1, 1, 1, 4);
      header.setFontWeight('bold');
      header.setBackground('#7c3aed');
      header.setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    // Leer los datos recibidos del formulario
    var data = JSON.parse(e.postData.contents);

    // Traducir valor de experiencia a texto legible
    var experienciaTexto = {
      'bien':    'Bien',
      'regular': 'Regular',
      'mal':     'Mal'
    }[data.experienciaPrevia] || data.experienciaPrevia;

    // Anadir fila con las respuestas
    sheet.appendRow([
      data.fecha || new Date().toLocaleString('es-ES'),
      experienciaTexto,
      data.justificacion   || '',
      data.expectativas    || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ resultado: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ resultado: 'error', mensaje: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Funcion de prueba - ejecutar manualmente desde el editor para verificar
function testDoPost() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        fecha:             '28/04/2025 10:00:00',
        experienciaPrevia: 'bien',
        justificacion:     'Todo ha ido genial en el cole anterior',
        expectativas:      'Esperamos que los ninos aprendan jugando y se sientan seguros'
      })
    }
  };
  var resultado = doPost(fakeEvent);
  Logger.log(resultado.getContent());
}
