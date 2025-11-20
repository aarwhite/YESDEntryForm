# School Competition Entry Form

A static website for schools to enter the competition. Data is submitted to a Google Sheet.

## Setup

1. **Google Sheets Backend**: Follow the instructions in [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) to create your backend and get the Web App URL.
2. **Configuration**: Paste your Web App URL into `script.js` (const `GOOGLE_SCRIPT_URL`).

## Running Locally

Since this project uses `fetch` to send data to Google Apps Script, it works best when running on a local web server (opening `index.html` directly may cause CORS issues).

### Option 1: Python (Recommended)
If you have Python 3 installed:

```bash
python3 -m http.server
```
Then open [http://localhost:8000](http://localhost:8000).

### Option 2: Node.js
If you have Node.js installed, you can use `serve`:

```bash
npx serve .
```

## Deployment

To deploy to GitHub Pages:
1. Push this code to a GitHub repository.
2. Go to Settings > Pages.
3. Select the `main` branch as the source.
