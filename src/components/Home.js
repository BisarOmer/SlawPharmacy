import React, { Component } from 'react';
import { forwardRef } from 'react';

import '../assets/css/Home.css'

//metrial ui
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';

import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';



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
import CropFreeOutlinedIcon from '@material-ui/icons/CropFreeOutlined';

import Check from '@material-ui/icons/Check';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';



//db 
import db from '../../Backend/db'
var dbQ = new db();

export default class Home extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedMenu: "Packet",
      quantity: 1,
      barcode: "",
      totalPrice: 0,

      userID: 0,
      pharmacyID: 0,

      isReturn: false,

      open: false,
      bulkProducts: [],
      openAutoComplete:false,

      SearchByName:[],
      loading:true,

    };
  }

  componentDidMount() {
    this.setState({ userID: localStorage.getItem("userID"), pharmacyID: localStorage.getItem("pharmacyID") })
  }

  render() {

    const handleChange = (event) => {
      if (event.target.name == "selectKind") {
        const name = event.target.name;
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

    const sellByEnter = async () => {

      var result = await dbQ.queryWithArg("select p.productID,p.type,p.barcode,p.expire,p.price,p.pillPerSheet,p.sheetPerPacket,d.name,d.drugID from products as p INNER JOIN drugs as d ON p.barcode=d.barcode where p.barcode = ?", this.state.barcode)

      if (result.length > 1) {
        var changeExpireToStr = result.map((item) => ({
          ...item, expire: ParseToDate(item.expire),
          quantity: this.state.quantity, total: (item.price * this.state.quantity), kind: this.state.selectedMenu
        }))
        this.setState({ bulkProducts: changeExpireToStr, open: true })
      }
      else {
        Object.assign(result[0], { quantity: this.state.quantity })
        Object.assign(result[0], { total: result[0].price * this.state.quantity })
        Object.assign(result[0], { kind: this.state.selectedMenu })

        this.setState((state) => ({ totalPrice: state.totalPrice + (result[0].price * state.quantity) }))
        this.state.data.push(result[0])
        this.setState({ barcode: "", quantity: 1, isReturn: false })
      }
    }

    const NameSearch = async (name)=>{
      var options = await dbQ.queryWithArg("SELECT barcode,name FROM drugs where name LIKE ? ",name+"%")
      if(options)
        this.setState({SearchByName:options})
    }

    const increment = () => {
      this.setState((state) => ({ quantity: (state.quantity + 1) }))
    }

    const decrement = () => {
      this.setState((state) => (state.quantity > 1 ? { quantity: state.quantity - 1 } : null))
    }

    const deleteFunc = () => {
      this.setState({ data: [], totalPrice: 0, quantity: 1 })
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

      var billID
      let date = new Date();

      if (!this.state.return) {
        dbQ.queryWithArgNoreturn("INSERT INTO `bills`( `pharmacyID`, `cashier`, `totalPrice`, `date`) VALUES (?,?,?,?)",
          [this.state.pharmacyID, this.state.userID, this.state.totalPrice, date]);

        let billIDPromise = dbQ.queryWithArg("select max(bill_ID) as billID from bills where cashier = ?", this.state.userID)


        await billIDPromise.then(async function (result) {
          billID = result[0].billID
        });
      }

      for (var i = 0; i < this.state.data.length; i++) {

        if (this.state.data[i].kind == "Pill") {

          // update products table
          dbQ.queryWithArgNoreturn("update  products set remainPill = remainPill" + returnOperation(this.state.isReturn) + "? where productID = ?",
            [this.state.data[i].quantity, this.state.data[i].productID]
          )

          if (this.state.data[i].quantity < this.state.data[i].pillPerSheet) {
            dbQ.queryWithArgNoreturn("update  products set remainSheet = remainSheet" + returnOperation(this.state.isReturn) + "1 where productID = ?", this.state.data[i].productID)
          }

          //insering to sold table
          if (!this.state.isReturn)
            insertToSold(this.state.data[i], billID, date)
        }

        else if (this.state.data[i].kind == "Sheet") {

          dbQ.queryWithArgNoreturn("update  products set remainSheet = remainSheet" + returnOperation(this.state.isReturn) + "? where productID = ?",
            [this.state.data[i].quantity, this.state.data[i].productID]
          )
          dbQ.queryWithArgNoreturn("update  products set remainPill = remainPill" + returnOperation(this.state.isReturn) + " ? where productID = ?",
            [(this.state.data[i].quantity * this.state.data[i].pillPerSheet), this.state.data[i].productID]
          )

          if (this.state.data[i].quantity < this.state.data[i].sheetPerPacket) {
            dbQ.queryWithArgNoreturn("update products set remainPacket = remainPacket" + returnOperation(this.state.isReturn) + " 1 where productID = ?", this.state.data[i].productID)
          }

          //insering to sold table
          if (!this.state.isReturn)
            insertToSold(this.state.data[i], billID, date)
        }

        else if (this.state.data[i].kind == "Packet") {

          dbQ.queryWithArgNoreturn("update products set remainPacket = remainPacket" + returnOperation(this.state.isReturn) + "? where productID = ?",
            [this.state.data[i].quantity, this.state.data[i].productID]
          )

          dbQ.queryWithArgNoreturn("update products set remainSheet = remainSheet" + returnOperation(this.state.isReturn) + " ? where productID = ?",
            [(this.state.data[i].quantity * this.state.data[i].sheetPerPacket), this.state.data[i].productID]
          )

          dbQ.queryWithArgNoreturn("update products set remainPill = remainPill" + returnOperation(this.state.isReturn) + " ? where productID = ?",
            [(this.state.data[i].quantity * this.state.data[i].sheetPerPacket) * this.state.data[i].pillPerSheet, this.state.data[i].productID]
          )

          //insering to sold table
          if (!this.state.isReturn)
            insertToSold(this.state.data[i], billID, date)
        }

      }

      deleteFunc();

    }

    const handleClose = () => {
      this.setState({ open: false })
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

    return (
      <div >

        <div className="flex-start-end">
          <Autocomplete
            size="small"
            id="asynchronous"
            style={{ width: 223 }}
            open={this.state.openAutoComplete}
            onOpen={() => {
              this.setState({openAutoComplete:true})
            }}
            onClose={() => {
              this.setState({openAutoComplete:false})
            }}
            onInputChange={(obj,value)=>{
              NameSearch(value)
            }}
            onChange={(event, value) =>value&&this.setState({barcode:value.barcode})}
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

        <div className="flex-start-end" style={{ marginTop: "1%" }}>
          <div className="flex" style={{ width: "24%", marginTop: 0 }}>
            <Button variant="contained" color="primary" size="small" onClick={lock}> Lock </Button>
            <Button variant="outlined" size="small">Print</Button>
          </div>
          <Button variant="outlined" color="secondary" size="small" onClick={deleteFunc} >Delete</Button>
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

      </div>
    );
  }
}
