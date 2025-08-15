# Fixing CORS Issues with Google Sheets API

The direct browser integration with Google Sheets API can face CORS (Cross-Origin Resource Sharing) issues. This document provides solutions to address these problems.

## Understanding the Problem

When your browser makes a direct request to the Google Sheets API from a different domain (e.g., your app's domain), the browser enforces the Same-Origin Policy. Google's API servers don't include the necessary CORS headers to permit cross-origin requests from browser JavaScript.

You'll typically see an error like:

```
Access to fetch at 'https://sheets.googleapis.com/v4/spreadsheets/...' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solution 1: Use a CORS Proxy for Development

For development purposes, you can use a CORS proxy to route your requests:

1. In your `.env` file, add:
   ```
   VITE_USE_CORS_PROXY=true
   ```

2. Optionally, specify a custom proxy:
   ```
   VITE_CORS_PROXY_URL=https://your-proxy-url.com/
   ```

3. The app will automatically route Google Sheets API requests through the proxy.

### Setting up your own CORS proxy

1. **Option A: Use cors-anywhere locally**
   ```bash
   npm install -g cors-anywhere
   cors-anywhere
   ```
   
   Then set in your `.env`:
   ```
   VITE_CORS_PROXY_URL=http://localhost:8080/
   ```

2. **Option B: Deploy your own cors-anywhere instance**
   - Fork [cors-anywhere on GitHub](https://github.com/Rob--W/cors-anywhere)
   - Deploy to a platform like Heroku, Vercel, or Netlify
   - Set the URL as your `VITE_CORS_PROXY_URL`

## Solution 2: Create a Google Apps Script Proxy (Recommended for Production)

For a more production-ready approach, create a Google Apps Script that acts as a proxy:

1. Go to [Google Apps Script](https://script.google.com/home) and create a new project

2. Replace the code with this proxy script:

```javascript
function doGet(request) {
  const spreadsheetId = request.parameter.id;
  const sheetName = request.parameter.sheet;
  const action = request.parameter.action || 'get';
  
  if (!spreadsheetId || !sheetName) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Missing required parameters'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    let result;
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        error: `Sheet "${sheetName}" not found`
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    switch(action) {
      case 'get':
        const data = sheet.getDataRange().getValues();
        result = { values: data };
        break;
        
      case 'update':
        // For update operations, you'd need to parse the values from request
        // This would require a doPost method and more complex handling
        result = { error: 'Update operations require doPost' };
        break;
        
      case 'clear':
        // Excluding first row (headers)
        if (sheet.getLastRow() > 1) {
          sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clear();
          result = { success: true };
        } else {
          result = { success: true, message: 'No data to clear' };
        }
        break;
        
      default:
        result = { error: `Unknown action: ${action}` };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(request) {
  const spreadsheetId = request.parameter.id;
  const sheetName = request.parameter.sheet;
  const action = request.parameter.action || 'update';
  
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        error: `Sheet "${sheetName}" not found`
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    let result;
    const postData = JSON.parse(request.postData.contents);
    
    switch(action) {
      case 'update':
        if (!postData.values) {
          return ContentService.createTextOutput(JSON.stringify({
            error: 'Missing values in request body'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Clear existing data first if specified
        if (postData.clearFirst === true) {
          sheet.clear();
        }
        
        // Write the values
        const values = postData.values;
        if (values.length > 0) {
          sheet.getRange(1, 1, values.length, values[0].length).setValues(values);
          result = { success: true };
        } else {
          result = { success: false, message: 'No values to update' };
        }
        break;
        
      default:
        result = { error: `Unknown action: ${action}` };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Deploy the script:
   - Click "Deploy" > "New deployment"
   - Select "Web app" as the type
   - Set access to "Anyone" (or restrict as needed)
   - Deploy and copy the URL

4. Update your code to use this proxy instead of direct API calls

## Solution 3: Use a Backend Server (Most Secure for Production)

For larger production applications:

1. Create a Node.js/Express (or other) backend server
2. Use the googleapis npm package server-side to interact with Sheets
3. Create your own API endpoints that relay requests to Google Sheets
4. Call your backend API from your React frontend

This approach:
- Keeps your API key secure (never exposed to the browser)
- Allows proper authentication via OAuth 2.0
- Enables fine-grained access control
- Avoids CORS issues completely

## Modifying the Existing Code

To switch from the current implementation to a different approach:

1. Edit the `GoogleSheetsService.ts` file
2. Update the fetch methods to use your new approach
3. The rest of the application can remain unchanged

The modularity of the current design allows for easy replacement of the data access layer without modifying the application logic. 