import React from 'react';
import { forwardRef } from 'react';

//metrial ui
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

//icon
import AddBox from '@material-ui/icons/AddBox';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';


//db 
import db from '../../Backend/db'
var dbQ = new db();

// store data 
const Store = require('electron-store');
const store = new Store();

// print
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default class Bills extends React.Component {

  //data is all bills datadetail is one bills data
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataDetail: [],

      cashierAndTotal: {},
      pharmacyName: localStorage.getItem("pharmacyName"),

      open: false
    };
    this.PrintBill = this.PrintBill.bind(this);
  }

  componentDidMount() {
    this.returnData()
  }

  // after mount
  async returnData () {
    // do not have cached
    // if (!store.get("bills")) {
      var result = await dbQ.queryWithArg("SELECT b.bill_ID,b.pharmacyID,b.totalPrice,b.date,b.cashier, u.username,u.userID FROM `bills` as b INNER JOIN users as u on b.cashier=u.userID WHERE b.pharmacyID = ? ORDER BY b.bill_ID DESC", localStorage.getItem("pharmacyID"))
      this.setState({ data: result })
    //   store.set("bills", result)
    // }
    // have cache
    // else {
    //   this.setState({ data: store.get("bills") })
    // }
  }

  //sold items are object of array we have to change to array and get some specific value to print
  soldItemsIntoArray() {

    var tempArr
    var soldItems = []
    var soldArr = []
    for (var i = 0; i < this.state.dataDetail.length; i++) {

      tempArr = Object.values(this.state.dataDetail[i])

      soldItems = []

      soldItems.push(tempArr[10])
      soldItems.push(tempArr[11])
      soldItems.push(tempArr[5])
      soldItems.push(tempArr[6])
      soldItems.push(tempArr[8])

      soldArr.push(soldItems)

    }

    return soldArr
  }

  PrintBill() {

    var dd = {
      pageSize: {
        width: 302.36,
        height: 'auto'
      },

      content: [
        { text: this.state.pharmacyName, style: 'header' },
        { text: 'Bill: ' + this.state.cashierAndTotal.billID },
        { text: 'Date: ' + this.state.cashierAndTotal.date.toLocaleString() },
        { text: 'Cashier: ' + this.state.cashierAndTotal.cashhier },
        { text: 'Items', style: 'subheader' },
        { text: 'Total = ' + this.state.cashierAndTotal.totalPrice, style: 'subheader' },
        { text: 'Developed By Slaw Pharmacy', alignment: 'center' },
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

    // arrya of sold items ready to print
    var items = this.soldItemsIntoArray()

    //addingg to table 
    for (var i = 0; i < items.length; i++) {
      tableObject.table.body.push(items[i])
    }
    //adding table to its index
    dd.content.splice(5, 0, tableObject)

    pdfMake.createPdf(dd).print();
  }

  render() {

    const columns = [
      { title: 'Number', field: 'bill_ID' },
      { title: 'Total Price', field: 'totalPrice', type: "numeric" },
      { title: 'Date ', field: 'date', type: 'date' },
      { title: 'Cashier', field: 'username' },

    ]

    const columnsDetail = [
      { title: 'Barcode', field: 'barcode' },
      { title: 'Name', field: 'name' },
      { title: 'Type ', field: 'type' },
      { title: 'Kind', field: 'kind' },
      { title: 'Quantity', field: 'quantity' },
      { title: 'Price', field: 'price' },
      { title: 'Total Price', field: 'totalPrice' },

    ]

    const tableIcons = {
      Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
      Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
      Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
      Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
      DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
      Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
      Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
      Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
      FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
      LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
      NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
      PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
      ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
      Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
      SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
      ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
      ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
    };

    const handleClose = () => {
      this.setState({ open: false })
    };

    return (
      <div>
        <MaterialTable
          title="Bills"
          columns={columns}
          data={this.state.data}
          icons={tableIcons}
          actions={[
            {
              icon: VisibilityIcon,
              tooltip: 'view',
              onClick: (event, rowData) => {

                const returnData = async () => {

                  var result = await dbQ.queryWithArg
                    (
                      "SELECT s.soldID,s.soldBy,s.bill_ID,s.productID,s.kind,s.quantity,s.price,s.date," +
                      "s.quantity*s.price AS totalPrice," +
                      "d.drugID,d.name," +
                      "p.productID,p.type,p.barcode,p.drugID " +
                      "FROM sold as s INNER JOIN products as p on p.productID=s.productID " +
                      "join drugs as d on p.drugID=d.drugID " +
                      "WHERE s.bill_ID=?",
                      rowData.bill_ID
                    )


                  var billDetail = { billID: rowData.bill_ID, date: rowData.date, totalPrice: rowData.totalPrice, cashhier: rowData.username }

                  this.setState({ dataDetail: result, cashierAndTotal: billDetail })

                }

                returnData()
                this.setState({ open: true })


              }
            }
          ]}
          options={{
            headerStyle: {
              backgroundColor: "#084177",
              color: '#FFF'
            },
            pageSizeOptions: [20, 30, 60],
            pageSize: 20
          }}
        />

        {/* view sold items which belong the bill */}
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={this.state.open} maxWidth="xl" fullWidth={true}>
          <MaterialTable
            title="Bill's Detail"
            columns={columnsDetail}
            data={this.state.dataDetail}
            icons={tableIcons}
            options={{
              headerStyle: {
                backgroundColor: "#084177",
                color: '#FFF'
              }
            }}
            editable={{
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  setTimeout(() => {
                    resolve();

                    this.setState((prevState) => {
                      const newDetail = prevState.dataDetail
                      newDetail.splice(newDetail.indexOf(oldData), 1);
                      dataDetail: newDetail
                    })

                    // dbQ.queryWithArgNoreturn("DELETE FROM `sold` WHERE `soldID` = ?", oldData.soldID)

                  }, 600);
                }),
            }}
          />

          <div style={{ padding: "1%", display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" size="small" onClick={this.PrintBill}>Print</Button>
            {/* <Button variant="outlined" color="secondary" size="small">Delete</Button> */}
          </div>
        </Dialog>

      </div >
    );


  }
}


