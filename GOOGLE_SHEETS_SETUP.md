# Google Sheets Backend Setup

Since your website is static (hosted on GitHub Pages), it cannot directly talk to a database securely. However, we can use a **Google Sheet** combined with **Google Apps Script** to act as a free database and API.

Follow these steps to set up your backend.

## 1. Create the Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a new blank sheet.
2. Name it something like `School Competition Entries`.
3. In the first row (headers), add the following columns:
   - **A1**: Timestamp
   - **B1**: School Name
   - **C1**: Contact Name
   - **D1**: Contact Email
   - **E1**: Estimated Teams

## 2. Create the Apps Script
1. In your Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete any code in the `Code.gs` file and paste the following code:

```javascript
const SHEET_NAME = "Sheet1"; // Make sure this matches your sheet tab name

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheetByName(SHEET_NAME);

    // Parse the incoming data
    // We expect the data to be sent as a JSON string in the post body
    const data = JSON.parse(e.postData.contents);

    const nextRow = sheet.getLastRow() + 1;

    // Add the row
    sheet.getRange(nextRow, 1, 1, 5).setValues([[
      new Date(),           // Timestamp
      data.schoolName,
      data.contactName,
      data.contactEmail,
      data.estimatedTeams
    ]]);

    // Send Confirmation Email
    if (data.contactEmail) {
      const subject = "Registration Confirmation - YESD Competition";
      const body = `Dear ${data.contactName},\n\n` +
                   `Thank you for registering ${data.schoolName}'s interest in the upcoming challenge.\n\n` +
                   `We have received your details and noted your estimated number of teams: ${data.estimatedTeams}.\n\n` +
                   `We will be in touch shortly with more information.\n\n` +
                   `Best regards,\n` +
                   `The YESD Team`;
      
      MailApp.sendEmail({
        to: data.contactEmail,
        subject: subject,
        body: body
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3. Save the project (Floppy disk icon or Cmd+S). Name it `EntryFormScript`.

## 3. Deploy as Web App
1. Click the blue **Deploy** button in the top right > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the details:
   - **Description**: Entry Form API
   - **Execute as**: `Me` (your email)
   - **Who has access**: `Anyone` (This is crucial so your public form can submit data)
4. Click **Deploy**.
5. You will be asked to **Authorize access**.
   - Click "Review permissions".
   - Choose your account.
   - You might see a "Google hasn't verified this app" warning (since you just wrote it). Click **Advanced** > **Go to EntryFormScript (unsafe)**.
   - Click **Allow**.

## 4. Connect to Your Website
1. After deployment, you will see a **Web app URL** (it starts with `https://script.google.com/macros/s/...`).
2. **Copy this URL.**
3. Open the `script.js` file in your project folder.
4. Replace the placeholder at the top with your new URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_LONG_ID_HERE/exec';
   ```
5. Save `script.js`.

## 5. Test It
1. Open `index.html` in your browser.
2. Fill out the form and submit.
3. Check your Google Sheet to see the new row appear!
