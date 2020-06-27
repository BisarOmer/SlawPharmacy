import React, { Component } from 'react';
import { forwardRef } from 'react';

// material ui
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';



//icons
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


const columns = [
    { title: 'Company ', field: 'name' },
    { title: 'Total  Debt', field: 'totalCost' },

];

const columnsDetail = [
    { title: 'Import  ', field: 'importNum' },
    { title: 'Add By', field: 'username' },
    { title: 'Date', field: 'date', type: 'date' },
    { title: 'Cost', field: 'cost'},
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


export default class Owe extends Component {

    constructor(props) {

        super(props);
        this.state = {
            data: [],
            oweDetail: [],
            totalOwe: 0,
            open: false,
        };
    }

    componentDidMount() {
        this.returnData()
    }

    async returnData() {
        var result = await dbQ.queryWithArg("SELECT i.from,i.importNum,SUM(i.cost) as totalCost,c.name from imports as i INNER JOIN companies as c ON i.from=c.companyID where i.paid = 1 and i.pharmacyId =? GROUP BY i.from",
            this.props.pharmacyID)
        this.setState({ data: result })

        var totalOweResult = await dbQ.queryWithArg("SELECT SUM(cost) as totalOwe from imports WHERE paid = 1 and pharmacyID = ?", this.props.pharmacyID)
        this.setState({ totalOwe: totalOweResult[0].totalOwe })
    }



    render() {

        const handleClose = () => {
            this.setState({ open: false })
        };

        return (
            <div>

                <div style={{ display: "flex", justifyContent: 'start ', marginBottom: "1%", flexWrap: 'wrap' }}>
                    <div style={{ padding: "1%", backgroundColor: "#f4f6ff", width: "20%", height: "150px", marginRight: "1%" }}>
                        <Typography variant="h6" gutterBottom>
                            Total Owe
                        </Typography>
                        <p style={{ fontSize: '40px', textAlign: 'center', margin: "0" }}>
                            {this.state.totalOwe}
                        </p>
                    </div>
                </div>

                <MaterialTable
                    title="Owe"
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
                    actions={[
                        {
                            icon: VisibilityIcon,
                            tooltip: 'view',
                            onClick: (event, rowData) => { 
                                const returnData = async () => {
                                    var result = await dbQ.queryWithArg
                                        ("SELECT i.importNum,i.addBy,i.date,i.cost, u.username from imports as i INNER JOIN users as u ON "+
                                        " i.addBy=u.userID WHERE i.importNum=?",rowData.importNum)

                                    this.setState({oweDetail:result})
                                }

                                returnData()
                                this.setState({ open: true })
                            }
                        }
                    ]}
                />


                {/* owe detail */}
                <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={this.state.open} maxWidth="xl" fullWidth={true}>
                    <MaterialTable
                        title="Imports"
                        columns={columnsDetail}
                        data={this.state.oweDetail}
                        icons={tableIcons}
                        options={{
                            headerStyle: {
                                backgroundColor: "#084177",
                                color: '#FFF'
                            }
                        }}
                    />
                </Dialog>

            </div >
        );
    }
}
