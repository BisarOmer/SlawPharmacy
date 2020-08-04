import React, { Component } from 'react';
import { forwardRef } from 'react';

import '../assets/css/Home.css'

//metrial ui
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';



//table
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

//icons
import SearchIcon from '@material-ui/icons/Search';

import Check from '@material-ui/icons/Check';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';



//db 
import db from '../../Backend/db'
var dbQ = new db();

// print
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// store data 
const Store = require('electron-store');
const store = new Store();


export default class Home extends Component {


  constructor(props) {
    super(props);
    this.state = {

      data: [],
      selectedMenu: "Packet",
      quantity: 1,
      barcode: "",
      totalPrice: 0,
      billID: 0,
      pharmacyName: localStorage.getItem("pharmacyName"),

      userID: 0,
      pharmacyID: 0,

      isPrint: store.get("isPrint"),
      isReturn: false,
      open: false,

      bulkProducts: [],
      openAutoComplete: false,

      SearchByName: [],


      drugDetail: [],
      quantityValidationOpen: false,

    };

    this.PrintBill = this.PrintBill.bind(this);
  }

  componentDidMount() {
    this.setState({ userID: localStorage.getItem("userID"), pharmacyID: localStorage.getItem("pharmacyID") })
    this.showExpireNotification()
  }

  async showExpireNotification() {
    if (!store.get("expireShowed", false)) {
      var expires = await dbQ.query("select COUNT(productID) as totalExpired FROM products WHERE expire < CURRENT_DATE")
      if (expires) {
        let myNotification = new Notification('Expire', {
          body: expires[0].totalExpired + ' Products Expired'
        })

        myNotification.onclick = () => {
          this.props.history.push("/drawer/report")
        }

        store.set("expireShowed",true)
      }
    }
  }

  soldItemsIntoArray() {

    var tempArr
    var soldItems = []
    var soldArr = []
    for (var i = 0; i < this.state.data.length; i++) {

      tempArr = Object.values(this.state.data[i])
      soldItems = []

      soldItems.push(tempArr[7])
      soldItems.push(tempArr[1])
      soldItems.push(tempArr[9])
      soldItems.push(tempArr[4])
      soldItems.push(tempArr[10])

      soldArr.push(soldItems)

    }

    return soldArr
  }

  PrintBill() {
    var date = new Date()
    var dd = {
      pageSize: {
        width: 302.36,
        height: 'auto'
      },
      content: [
        { text: this.state.pharmacyName, style: 'header' },
        { text: 'Bill: ' + this.state.billID },
        { text: 'Date: ' + date.toLocaleString() },
        { text: 'Cashier: ' + localStorage.getItem('username') },
        { text: 'Items', style: 'subheader' },
        { text: 'Total = ' + this.state.totalPrice, style: 'subheader' },
        { text: 'Developed By Slaw Company', alignment: 'center' },
      ]
      ,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: 'center'
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }

    }

    var tableObject =
    {
      style: 'tableExample',
      table: {
        body: [
          ['Name', 'Type', 'Quantity', 'Price', 'Total'],
        ]
      }
    }

    var items = this.soldItemsIntoArray()

    for (var i = 0; i < items.length; i++) {
      tableObject.table.body.push(items[i])
    }

    dd.content.splice(5, 0, tableObject)

    pdfMake.createPdf(dd).print();
  }

  render() {

    const handleChange = (event) => {

      if (event.target.name == "selectKind") {
        this.setState({ selectedMenu: event.target.value })
      }
      else if (event.target.name == "quantity") {
        this.setState({ quantity: event.target.value })
      }

      else if (event.target.name == "barcode") {
        this.setState({ barcode: event.target.value })
      }

      else if (event.target.name = "selectStatus") {
        this.setState({ isReturn: event.target.value })
      }
    };

    const handleChangePrint = () => {
      if (store.get('isPrint')) {
        store.set('isPrint', false); this.setState({ isPrint: false })
      }
      else {
        store.set('isPrint', true); this.setState({ isPrint: true })
      }
      // this.state.isPrint ? this.setState({isPrint:false}):this.setState({isPrint:true})
    }

    const sellByEnter = async () => {

      var result = await dbQ.queryWithArg("select p.productID,p.type,p.barcode,p.expire,p.price,p.pillPerSheet,p.sheetPerPacket,d.name,d.drugID from products as p INNER JOIN drugs as d ON p.barcode=d.barcode where p.barcode = ? and p.pharmacyID=? and p.remainPacket >= ?",
        [this.state.barcode, this.state.pharmacyID, this.state.quantity])

      if (result.length) {
        var drugDetailResult = await dbQ.queryWithArg("SELECT `name`, `scintificName`, `indication`, `sideEffect`, `content` FROM `drugs` WHERE barcode =?", this.state.barcode)

        this.state.drugDetail.push(drugDetailResult[0])
      }

      if (result.length > 1) {
        var moreThanPneReturned = result.map((item) => ({
          ...item, expire: ParseToDate(item.expire),
          quantity: this.state.quantity, total: (item.price * this.state.quantity), kind: this.state.selectedMenu
        }))
        this.setState({ bulkProducts: moreThanPneReturned, open: true })
      }

      else if (result.length == 1) {
        Object.assign(result[0], { quantity: this.state.quantity })
        Object.assign(result[0], { total: result[0].price * this.state.quantity })
        Object.assign(result[0], { kind: this.state.selectedMenu })

        this.setState((state) => ({ totalPrice: state.totalPrice + (result[0].price * state.quantity) }))
        this.state.data.push(result[0])
        this.setState({ barcode: "", quantity: 1, isReturn: false })
      }

      else {
        this.setState({ quantityValidationOpen: true })
      }
    }

    const NameSearch = async (name) => {
      var options = await dbQ.queryWithArg("SELECT barcode,name FROM drugs where name LIKE ? ", name + "%")
      if (options)
        this.setState({ SearchByName: options })
    }

    const increment = () => {
      this.setState((state) => ({ quantity: (parseInt(state.quantity) + 1) }))
    }

    const decrement = () => {
      this.setState((state) => (state.quantity > 1 ? { quantity: state.quantity - 1 } : null))
    }

    const deleteFunc = () => {
      this.setState({ data: [], totalPrice: 0, quantity: 1, drugDetail: [] })

    }

    const returnOperation = (isReturn) => {
      if (isReturn)
        return "+"
      else
        return "-"
    }

    const insertToSold = (solded, billID, date) => {
      dbQ.queryWithArgNoreturn("INSERT INTO `sold`(`soldBy`, `bill_ID`, `productID`, `kind`, `quantity`, `price`, `date`) VALUES (?,?,?,?,?,?,?)",
        [this.state.userID, billID, solded.productID, solded.kind, solded.quantity, solded.price, date])
    }

    const lock = async () => {
      let currentComponent = this;

      let date = new Date();

      if (this.state.data.length) {

        if (!this.state.return) {
          dbQ.queryWithArgNoreturn("INSERT INTO `bills`( `pharmacyID`, `cashier`, `totalPrice`, `date`) VALUES (?,?,?,?)",
            [this.state.pharmacyID, this.state.userID, this.state.totalPrice, date]);

          let billIDPromise = dbQ.queryWithArg("select max(bill_ID) as billID from bills where cashier = ? and pharmacyID=?", [this.state.userID, this.state.pharmacyID])


          await billIDPromise.then(async function (result) {


            currentComponent.setState({ billID: result[0].billID })
          });
        }

        for (var i = 0; i < this.state.data.length; i++) {

          if (this.state.data[i].kind == "Pill") {

            // update products table
            dbQ.queryWithArgNoreturn("update  products set remainPill = remainPill" + returnOperation(this.state.isReturn) + "? where productID = ? and pharmacyID=?",
              [this.state.data[i].quantity, this.state.data[i].productID, this.state.pharmacyID]
            )

            if (this.state.data[i].quantity < this.state.data[i].pillPerSheet) {
              dbQ.queryWithArgNoreturn("update  products set remainSheet = remainSheet" + returnOperation(this.state.isReturn) + "1 where productID = ? and pharmacyID=?",
                [this.state.data[i].productID, this.state.pharmacyID])
            }

            //insering to sold table
            if (!this.state.isReturn)
              insertToSold(this.state.data[i], this.state.billID, date)
          }

          else if (this.state.data[i].kind == "Sheet") {

            dbQ.queryWithArgNoreturn("update  products set remainSheet = remainSheet" + returnOperation(this.state.isReturn) + "? where productID = ? and pharmacyID=?",
              [this.state.data[i].quantity, this.state.data[i].productID, this.state.pharmacyID]
            )
            dbQ.queryWithArgNoreturn("update  products set remainPill = remainPill" + returnOperation(this.state.isReturn) + " ? where productID = ? and pharmacyID=?",
              [(this.state.data[i].quantity * this.state.data[i].pillPerSheet), this.state.data[i].productID, this.state.pharmacyID]
            )

            if (this.state.data[i].quantity < this.state.data[i].sheetPerPacket) {
              dbQ.queryWithArgNoreturn("update products set remainPacket = remainPacket" + returnOperation(this.state.isReturn) + " 1 where productID = ? and pharmacyID=?",
                [this.state.data[i].productID, this.state.pharmacyID])
            }

            //insering to sold table
            if (!this.state.isReturn)
              insertToSold(this.state.data[i], this.state.billID, date)
          }

          else if (this.state.data[i].kind == "Packet") {

            dbQ.queryWithArgNoreturn("update products set remainPacket = remainPacket" + returnOperation(this.state.isReturn) + "? where productID = ? and pharmacyID =? ",
              [this.state.data[i].quantity, this.state.data[i].productID, this.state.pharmacyID]
            )

            dbQ.queryWithArgNoreturn("update products set remainSheet = remainSheet" + returnOperation(this.state.isReturn) + " ? where productID = ? and pharmacyID =? ",
              [(this.state.data[i].quantity * this.state.data[i].sheetPerPacket), this.state.data[i].productID, this.state.pharmacyID]
            )

            dbQ.queryWithArgNoreturn("update products set remainPill = remainPill" + returnOperation(this.state.isReturn) + " ? where productID = ? and pharmacyID =? ",
              [(this.state.data[i].quantity * this.state.data[i].sheetPerPacket) * this.state.data[i].pillPerSheet, this.state.data[i].productID, this.state.pharmacyID]
            )

            //insering to sold table
            if (!this.state.isReturn)
              insertToSold(this.state.data[i], this.state.billID, date)
          }

        }

        this.state.isPrint ? this.PrintBill() : null
        deleteFunc();
      }
    }

    const handleClose = () => {
      this.setState({ open: false, quantityValidationOpen: false })
    }

    const columnsDetail = [
      { title: 'Barcode', field: 'barcode' },
      { title: 'Name', field: 'name' },
      { title: 'Type', field: 'type' },
      { title: 'Expire', field: 'expire' },
      { title: 'Quantity', field: 'quantity' },
      { title: 'Price', field: 'price' },
    ]

    const tableIcons = {
      FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
      LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
      NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
      PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
      ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
      Search: forwardRef((props, ref) => <SearchIcon {...props} ref={ref} />),
      Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    }

    const ParseToDate = (date) => {
      if (date) {
        let year = date.getFullYear();
        let month = (date.getUTCMonth() + 1 <= 9) ? "0" + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1
        let day = (date.getDate() <= 9) ? "0" + (date.getDate()) : date.getDate()
        return year + '-' + month + '-' + day
      } else {
        return date;
      }
    }

    const rows = this.state.data
    const details = this.state.drugDetail


    return (
      <div >

        {/*  search by name  */}
        <div className="flex-start-end">
          <Autocomplete
            size="small"
            id="asynchronous"
            style={{ width: 210 }}
            open={this.state.openAutoComplete}
            onOpen={() => {
              this.setState({ openAutoComplete: true })
            }}
            onClose={() => {
              this.setState({ openAutoComplete: false })
            }}
            onInputChange={(obj, value) => {
              NameSearch(value)
            }}
            onChange={(event, value) => value && this.setState({ barcode: value.barcode })}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={this.state.SearchByName}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search"
                variant="outlined"
              />
            )}
          />
        </div>
        
        {/* control row  */}
        <div className='flex'>

          <TextField id="outlined-basic" label="Barcode" name="barcode"
            value={this.state.barcode}
            variant="outlined"
            size="small"
            type="number"
            onChange={handleChange}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                sellByEnter();
              }
            }} />

          <div className='flex'>

            <TextField id="outlined-basic" label="Quantity" name="quantity" value={this.state.quantity} onChange={handleChange}
              type="number" variant="outlined" size="small" />

            <div className="flex-ver">
              <IconButton aria-label="delete" color="primary" size="small" onClick={increment}>
                <ExpandLessIcon />
              </IconButton>
              <IconButton aria-label="delete" color="primary" size="small" onClick={decrement}>
                <ExpandMoreIcon />
              </IconButton>
            </div>
          </div>

          <FormControl variant="outlined" className="formControl" size="small" type="number">
            <Select name="selectKind" value={this.state.selectedMenu} onChange={handleChange}>
              <MenuItem value="Packet">Packet</MenuItem>
              <MenuItem value="Sheet">Sheet</MenuItem>
              <MenuItem value="Pill">Pill</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" className="formControl" size="small" type="number">
            <Select name="selectStatus" value={this.state.isReturn} onChange={handleChange}>
              <MenuItem value={false}>Sell</MenuItem>
              <MenuItem value={true}>Return</MenuItem>
            </Select>
          </FormControl>


          <h1 className="totalPrice">{this.state.totalPrice}</h1>

        </div>

        {/* sold drgs table  */}
        <div style={{ marginTop: "1%" }}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Barcode</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Type</TableCell>
                  <TableCell align="left">Expire</TableCell>
                  <TableCell align="left">Quantity</TableCell>
                  <TableCell align="left">Price</TableCell>
                  <TableCell align="left">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.barcode}>
                    <TableCell component="th" scope="row">{row.barcode} </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.type}</TableCell>
                    <TableCell align="left">{ParseToDate(row.expire)}</TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                    <TableCell align="left">{row.price}</TableCell>
                    <TableCell align="left">{row.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* drugs detail */}
        <Typography style={{ marginTop: "2%" }} variant="h6" gutterBottom>
          Drug's Information
        </Typography>

        <div style={{ marginTop: "1%" }}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Scintific Name</TableCell>
                  <TableCell align="left">Indication</TableCell>
                  <TableCell align="left">Side Effect</TableCell>
                  <TableCell align="left">Content</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {details.map((row) => (
                  <TableRow key={row.scintificName}>
                    <TableCell align="left" >{row.scintificName} </TableCell>
                    <TableCell align="left">{row.indication} </TableCell>
                    <TableCell align="left">{row.sideEffect}</TableCell>
                    <TableCell align="left">{row.content}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* btn lock,delete,switch to print */}
        <div className="flex-start-end" style={{ marginTop: "1%" }}>
          <div className="flex" style={{ width: "24%", marginTop: 0 }}>
            <Button variant="contained" color="primary" size="small" onClick={lock}> Lock </Button>
            {/* <Button variant="outlined" size="small" onClick={this.PrintBill}>Print</Button> */}
          </div>

          <div className="flex" style={{ width: '22%' }}>
            <Box fontSize={15} >
              Print
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={this.state.isPrint}
                  onChange={handleChangePrint}
                  name="isPrint"
                  color="primary"

                />
              }
            />
            <Button style={{ marginLeft: "2%" }} variant="outlined" color="secondary" size="small" onClick={deleteFunc} >Delete</Button>
          </div>
        </div>

        {/*  bulk returnted product */}
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={this.state.open} maxWidth="xl" fullWidth={true}>

          <MaterialTable
            title="Medicines"
            columns={columnsDetail}
            data={this.state.bulkProducts}
            options={{
              headerStyle: {
                backgroundColor: "#084177",
                color: '#FFF'
              }
            }}
            icons={tableIcons}
            actions={[
              {
                icon: Check,
                tooltip: 'Select',
                onClick: (event, rowData) => {

                  var ExpireReturnToLong = { ...rowData, expire: new Date(rowData.expire) }
                  this.setState((state) => ({ totalPrice: state.totalPrice + (ExpireReturnToLong.price * state.quantity) }))

                  this.state.data.push(ExpireReturnToLong)
                  this.setState({ barcode: "", quantity: 1 })

                  this.setState({ open: false, isReturn: false })

                }
              }
            ]}
          />
        </Dialog>

        {/* dialog validation that must sell quantity equal or less than available */}
        <Dialog
          open={this.state.quantityValidationOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >

          <DialogTitle id="alert-dialog-title">{"Less Quantity Available"}</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    );
  }
}
