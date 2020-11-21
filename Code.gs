function myFunction() 
{
   // today's date information
  var today = new Date();
  var todayMonth = today.getMonth() + 1;
  var todayDay = today.getDate();
  var todayYear = today.getFullYear();

  // 2 weeks from now
  var twoWeeksFromToday = new Date();
  twoWeeksFromToday.setDate(twoWeeksFromToday.getDate() + 14);
  var twoWeeksMonth = twoWeeksFromToday.getMonth() + 1;
  var twoWeeksDay = twoWeeksFromToday.getDate();
  var twoWeeksYear = twoWeeksFromToday.getFullYear();
  
  
  // getting data from spreadsheet
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName("Sheet1")
  var startRow = 2; // First row of data to process
  var numRows = sheet.getLastRow(); // Number of rows to process

  var dataRange = sheet.getRange(startRow, 1, numRows, 15);
  var data = dataRange.getValues();
  
   //looping through all of the rows
  for (var i = 0; i < data.length; ++i)
  {
    var row = data[i];
    var expireDateFormat = Utilities.formatDate(new Date(row[5]),'ET','MM/dd/yyyy');
    //Logger.log(expireDateFormat) 
     // email information
    var subject = '';
    
    //storing Values
    var appname = row[0]
    var summary = row[2]
    var jira =row[3]
    var duedate = row[5]
    
    //temlate for dueed issues
    var templ = HtmlService.createTemplateFromFile('email');
    templ.appname = appname;
    templ.summary = summary;
    templ.jira = jira;
    templ.duedate = duedate;
    
    var message = templ.evaluate().getContent();
    
    //temlate for due in 2 week
    var templ1 = HtmlService.createTemplateFromFile('email1');
    templ1.appname = appname;
    templ1.summary = summary;
    templ1.jira = jira;
    templ1.duedate = duedate;
    
    var message1 = templ1.evaluate().getContent();
    
    
    //finding recepents
      var recipientsTO = row[7] + "," + row[8];
      var recipientsCC = row[6]
          
          
        //expiration date information
    var expireDateMonth = new Date(row[5]).getMonth() + 1;
    var expireDateDay = new Date(row[5]).getDate();
    var expireDateYear = new Date(row[5]).getFullYear();
    
    //checking for today
    if (expireDateMonth === todayMonth && expireDateDay === todayDay && expireDateYear === todayYear)
    {
      var subject = 'Gentel Reminder!! ' + '[Security Issue] ' + row[3] + ' Due today ' + ' : ' + row[5];
       MailApp.sendEmail({to: recipientsTO,cc: recipientsCC,subject: subject, htmlBody: message});
     // Logger.log("in");
    }
    
    //checking for 2 weeks from now
    if (expireDateMonth === twoWeeksMonth && expireDateDay === twoWeeksDay && expireDateYear === twoWeeksYear) 
    {
      var subject = 'Gentel Reminder!! ' + ' [Security Issue] ' + row[3] + ' Due In  2 Weeks ' + ' : ' + expireDateFormat;
      MailApp.sendEmail({to: recipientsTO,cc: recipientsCC,subject: subject, htmlBody: message1});
      Logger.log('2 weeks from now');
    }
  }
}
