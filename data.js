const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');

// Function to extract company name and website URL
function extractCompanyInfo(data) {
  return data.map(company => ({
    name: company.summary.name,
    websiteUrl: company.websiteUrl
  }));
}

// Read data from a JSON file
const inputFilePath = path.join(__dirname, 'TOP 100 UK Staffing companies.json');
const outputFilePath = path.join(__dirname, 'output.csv');

fs.readFile(inputFilePath, 'utf8', (err, jsonData) => {
  if (err) {
    console.error('Error reading input JSON file:', err);
    return;
  }

  try {
    const data = JSON.parse(jsonData);
    const extractedData = extractCompanyInfo(data);
    const csv = parse(extractedData);
    
    // Write the extracted data to a new CSV file
    fs.writeFile(outputFilePath, csv, (err) => {
      if (err) {
        console.error('Error writing output CSV file:', err);
        return;
      }
      console.log("Extracted data saved to 'output.csv'");
    });
  } catch (err) {
    console.error('Error processing JSON data:', err);
  }
});
