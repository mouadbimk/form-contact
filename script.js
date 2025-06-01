'use strict'

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
const doPost = (request={}) =>{
  const contents = request?.postData?.contents || '';
  const type = request?.postData?.type ||'';
  const data = parseFormData(contents);
  appendToGoogleSheet(data);

  PropertiesService.getScriptProperties().setProperty('lastInsert','true');

  return ContentService.createTextOutput(contents).setMimeType(ContentService.MimeType.JSON);
};
function parseFormData(postData){
  let data = {};
  const parameters = postData.split('&');
  for (let param of parameters){
    const keyValue = param.split('=');
    data[keyValue[0]] = decodeURIComponent(keyValue[1] ||'');
  }
  return data;
}
function appendToGoogleSheet(data){
  const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  const rowData = headers.map(headerFld => data[headerFld] ?? '');
  sheet.appendRow(rowData);
}
function doGet(){
    const check = PropertiesService.getScriptProperties().getProperty('lastInsert');

    if(check === 'true'){
            PropertiesService.getScriptProperties().deleteProperty('lastInsert');
        return ContentService.createTextOutput('data Insert in table').setMimeType(ContentService.MimeType.TEXT)
    }else{
        return ContentService.createTextOutput('No new data').setMimeType(ContentService.MimeType.TEXT)
    }
}