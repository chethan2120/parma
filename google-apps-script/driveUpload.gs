// WebNxt — Resume Upload to Google Drive
// ─────────────────────────────────────────────────────────
// FOLDER_ID: the ID of your "WebNxt Resumes" Google Drive folder
// ─────────────────────────────────────────────────────────

var FOLDER_ID = '1blpJCO4vd2Pzf0lJSwhg7milEliV1EDK';

// ── POST handler ───────────────────────────────────────────

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    if (!payload.name || !payload.data) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Missing name or data' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var folder = DriveApp.getFolderById(FOLDER_ID);
    var decoded = Utilities.base64Decode(payload.data);
    var blob = Utilities.newBlob(
      decoded,
      payload.mimeType || 'application/octet-stream',
      payload.name
    );

    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        url: file.getUrl(),
        name: file.getName(),
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── GET handler (health check) ─────────────────────────────

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', service: 'WebNxt Drive Upload' }))
    .setMimeType(ContentService.MimeType.JSON);
}
