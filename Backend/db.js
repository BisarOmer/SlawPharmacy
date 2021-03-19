const electron = require('electron');
var data = [];
export default class db {

  constructor() { }

  query(sql) {
    var data = electron.ipcRenderer.sendSync("query", sql)
    return data
  }

  async queryWithArg(sql, para) {

    var data = electron.ipcRenderer.sendSync("queryWithArg", sql, para)

    return data
  }

  queryWithArgNoreturn(sql, para) {
    electron.ipcRenderer.send('queryWithArg', sql, para);
  }

}