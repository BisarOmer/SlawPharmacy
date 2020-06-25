const electron = require('electron');
var data = [];
export default class db {

  constructor() { }

  query(sql) {

    // electron.ipcRenderer.send('query', sql);
    // electron.ipcRenderer.on('result', (event, arg) => {
    //   data = arg;
    // })

   var data = electron.ipcRenderer.sendSync("query",sql)
    return data
  }

  async queryWithArg(sql, para) {

    // electron.ipcRenderer.send('queryWithArg', sql, para);
    // electron.ipcRenderer.on('resultwithPara', (event, arg) => {
    //   data = arg;
    // })

   var data = electron.ipcRenderer.sendSync("queryWithArg",sql,para)
   
    return data
  }

  queryWithArgNoreturn(sql, para) {
    electron.ipcRenderer.send('queryWithArg', sql, para);
  }

}


    // electron.ipcRenderer.on('asynchronous-reply', (event, arg) => {
    //   console.log(arg) // prints "pong"
    // })
    // electron.ipcRenderer.send('asynchronous-message', 'ping')