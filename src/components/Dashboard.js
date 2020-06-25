import React, { Component } from 'react';
import { forwardRef } from 'react';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Typography from '@material-ui/core/Typography';


import MaterialTable from 'material-table';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import AddBox from '@material-ui/icons/AddBox';
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


const columns = [
    { title: 'Barcode', field: 'barcode' },
    { title: 'Name', field: 'name' },
    { title: 'Type', field: 'type' },
    { title: 'Quantity ', field: 'quantity' },
    { title: 'Kind ', field: 'kind' },
    { title: 'Price', field: 'price' },
    { title: 'Total', field: 'totalPrice' },
    { title: 'Cashier', field: 'username' },
];


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


export default class Dashboard extends Component {

    constructor(props) {
        var utc = new Date()
        super(props);
        this.state = {
            data: [],
            selectedDate: utc,
            profit: 0,
            cost: 0,
            total: 0,
            monthly: false,
        };
    }

    ParseToDate(date) {
        if (date) {
            let year = date.getFullYear();
            let month = (date.getUTCMonth() + 1 <= 9) ? "0" + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1
            let day = (date.getDate() <= 9) ? "0" + (date.getDate()) : date.getDate()
            return year + '-' + month + '-' + day
        } else {
            return date;
        }
    }

    ParseToMonth(date) {

        if (date) {
            let month = (date.getUTCMonth() + 1 <= 9) ? "0" + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1
            return month
        } else {
            return date;
        }
    }

    componentDidMount() {
        this.returnDataByDay(this.state.selectedDate)
    }

    monthQuery() {
        return !this.state.monthly ? "s.date," : "MONTH(s.date) AS MONTH,"
    }

    monthWhereQuery() {
        return !this.state.monthly ? "s.date" : "MONTH"
    }

    profitMonth() {
        return !this.state.monthly ? "s.date" : "MONTH(s.date) "
    }

    async returnDataByDay(date) {

        // var dateSplitbyHyphen = date.split('/').join('-') .toLocaleDateString()

        var dateSplitbyHyphen = await !this.state.monthly ? this.ParseToDate(date) : this.ParseToMonth(date)


        var result = await dbQ.queryWithArg
            (
                " SELECT" +
                " s.soldBy," +
                " s.bill_ID," +
                " s.productID," +
                " s.kind," +
                " s.quantity," +
                " s.price," +
                this.monthQuery() +
                " s.quantity * s.price AS totalPrice," +
                " u.userID," +
                " u.username," +
                " d.name," +
                " d.barcode," +
                " d.drugID," +
                " p.type" +
                " FROM" +
                " sold AS s" +
                " INNER JOIN users AS u" +
                " ON" +
                " s.soldBy = u.userID" +
                " JOIN drugs AS d" +
                " ON" +
                " d.drugID = (" +
                " SELECT" +
                " drugID" +
                " FROM" +
                " products" +
                " WHERE" +
                " productID = s.productID)" +
                " JOIN products AS p" +
                " ON" +
                " p.productID = s.productID" +
                " HAVING " +
                this.monthWhereQuery() + "= ?"
                , dateSplitbyHyphen
            )

        var costAndProfit = await dbQ.queryWithArg(
            "SELECT s.productID, SUM(s.price * s.quantity) AS total, p.productID, SUM(p.cost * s.quantity) AS cost,SUM(s.price * s.quantity) - SUM(p.cost * s.quantity) as profit " +
            "FROM sold AS s INNER JOIN products AS p ON s.productID = p.productID where " + this.profitMonth() + " = ? ", dateSplitbyHyphen)

        this.setState({ data: result })

        this.setState({ profit: costAndProfit[0].profit, cost: costAndProfit[0].cost, total: costAndProfit[0].total })
        
        
        
        

    }

    render() {

        const handleDateChange = async (date) => {
            this.setState({ selectedDate: await date })
            this.returnDataByDay(this.state.selectedDate)
        };

        const handleChange = async () => {
            await !this.state.monthly ? this.setState({ monthly: true }) : this.setState({ monthly: false })
            this.returnDataByDay(this.state.selectedDate)
        }

        return (
            <div>

                <div style={{ display: "flex", justifyContent: 'space-around ', marginBottom: "1%", flexWrap: 'wrap' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'flex-start' }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>

                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="Date"
                                onChange={handleDateChange}
                                value={this.state.selectedDate}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>

                        <Typography variant="button" >
                            Monthly
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.monthly}
                                    onChange={handleChange}
                                    name="switchMonth"
                                    color="primary"
                                />
                            }

                        />
                    </div>

                    <div style={{ padding: "1%", backgroundColor: "#f4f6ff", width: "20%", height: "150px", marginRight: "1%" }}>
                        <Typography variant="h6" gutterBottom>
                            Total
                        </Typography>

                        <p style={{ fontSize: '40px', textAlign: 'center', margin: "0" }}>
                            {this.state.total}
                        </p>
                    </div>

                    <div style={{ padding: "1%", backgroundColor: "#f4f6ff", width: "20%", height: "150px", marginRight: "1%" }}>
                        <Typography variant="h6" gutterBottom>
                            Cost
                        </Typography>

                        <p style={{ fontSize: '40px', textAlign: 'center', margin: "0" }}>
                            {this.state.cost}
                        </p>
                    </div>

                    <div style={{ padding: "1%", backgroundColor: "#6decb9", width: "20%", height: "150px", marginRight: "1%" }}>
                        <Typography variant="h6" style={{ color: "white" }} gutterBottom>
                            Profit
                        </Typography>

                        <p style={{ fontSize: '40px', textAlign: 'center', color: "white", margin: "0" }}>
                            {this.state.profit}
                        </p>
                    </div>

                </div>

                <MaterialTable
                    title="Sold"
                    columns={columns}
                    data={this.state.data}
                    icons={tableIcons}
                    options={{
                        headerStyle: {
                            backgroundColor: "#084177",
                            color: '#FFF'
                        },
                        pageSizeOptions: [20, 30, 60],
                        pageSize: 20
                    }}
                />

            </div >
        );
    }
}
