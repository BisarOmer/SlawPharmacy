import React from 'react';
import { forwardRef } from 'react';

//metrial ui
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

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


export default function Imports() {

    const [data, setData] = React.useState([])
    const [companies, setCompanies] = React.useState([])


    const [importData, setImportData] = React.useState([])
    const [ParmacyID, setPharmacyId] = React.useState([])
    const [userID, setUserID] = React.useState([])

    const [headerData, setHeader] = React.useState()
    const [open, setOpen] = React.useState(false);
    const [openValidation, setOpenvalidation] = React.useState(false);



    React.useEffect(() => {
        var result = dbQ.query(
            "SELECT i.`importID`, i.`pharmacyID`, i.`addBy`, i.`importNum`,  i.`cost`, i.`date`, i.`paid`,IF(i.paid=0,'Owe','Paid') as 'status',c.name,c.companyID,u.username " +
            " FROM `imports` as i   INNER JOIN companies as c  ON i.from = c.companyID join users as u on i.addBy = u.userID" +
            " ORDER BY i.`importID` DESC"
        )
        setData(result)

        var returnedCompanies = dbQ.query("select companyID,name from companies")
        setCompanies(returnedCompanies)

        setPharmacyId(localStorage.getItem("pharmacyID"))
        setUserID(localStorage.getItem("userID"))
    }, []);

    const columns = [
        { title: 'Number', field: 'importNum' },
        { title: 'From', field: 'name', editComponent: props => (ListCompany(props)) },
        { title: 'Cost ', field: 'cost', type: "numeric" },
        { title: 'Date ', field: 'date', type: 'date' },
        { title: 'Status', field: 'status', editComponent: props => (ListStatus(props)) },
        { title: 'Add By', field: 'username', editable: 'never' },

    ]

    const status = [
        { status: "Paid", value: "1" },
        { status: "Owe", value: "0" },
    ]

    function ListCompany(props) {
        return (
            <Autocomplete
                id="tags-standard"
                style={{ width: 250 }}
                size="small"
                fullWidth={true}
                options={companies}
                getOptionLabel={(companies) => companies.name}
                onChange={(event, value) => value && props.onChange(value.companyID)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        placeholder="Company"
                        size="small"
                    />
                )}
            />
        )
    }

    function ListStatus(props) {
        return (
            <Autocomplete
                id="tags-standard"
                style={{ width: 150 }}
                size="small"
                fullWidth={true}
                options={status}
                getOptionLabel={(status) => status.status}
                onChange={(event, value) => value && props.onChange(value.value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        placeholder="Status"
                        size="small"
                    />
                )}
            />
        )
    }

    const columnsDetail = [
        { title: 'Barcode', field: 'barcode' },
        { title: 'Name', field: 'name' },
        { title: 'Type', field: 'type' },
        { title: 'Packet', field: 'packet' },
        { title: 'Sheet', field: 'sheet' },
        { title: 'Pill', field: 'pill' },
        { title: 'Cost ', field: 'cost', type: "numeric" },
    ]

    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => <DeleteOutline color="secondary" {...props} ref={ref} />),
        DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        Edit: forwardRef((props, ref) => <Edit color="primary" {...props} ref={ref} />),
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
        setOpen(false);
        setOpenvalidation(false);
    };

    const styles = (theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

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

    // change owe and paid to 0,1
    const changeStatus = (value) => {
        var smallCaseValue = value.toLowerCase();
        if (smallCaseValue == "owe")
            return 0
        else (smallCaseValue == "paid")
        return 1
    }

    return (
        <div>

            <MaterialTable
                title="Imports"
                columns={columns}
                data={data}
                editable={{
                    onRowAdd: (newData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {

                                if (Object.keys(newData).length == 5) {
                                    resolve();
                                    setData((prevState) => {
                                        const data = [...prevState];
                                        data.push(newData);
                                        return data
                                    });

                                    dbQ.queryWithArgNoreturn("INSERT INTO `imports`(`pharmacyID`, `addBy`, `importNum`, `from`, `cost`, `date`, `paid`) VALUES (?,?,?,?,?,?,?)",
                                        [ParmacyID, userID, newData.importNum, newData.name, newData.cost, newData.date, newData.status]
                                    )
                                }
                                else {
                                    setOpenvalidation(true)
                                    resolve();
                                }

                            }, 600);
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                if (oldData) {
                                    if (Object.keys(newData).length == 5) {
                                        setData((prevState) => {
                                            const data = [...prevState];
                                            data[data.indexOf(oldData)] = newData;
                                            return data
                                        });
                                        var newStatus = changeStatus(newData.status)
                                        dbQ.queryWithArgNoreturn("UPDATE `imports` SET `importNum`=?,`addBy`=?,`from`=?,`cost`=?,`date`=?,`paid`=? WHERE importID =?",
                                            [parseInt(newData.importNum), userID, newData.name, newData.cost, newData.date, newStatus, oldData.importID]
                                        )
                                    }
                                    else {
                                        setOpenvalidation(true)
                                        resolve();
                                    }
                                }
                            }, 600);
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                setData((prevState) => {
                                    const data = [...prevState];
                                    data.splice(data.indexOf(oldData), 1);
                                    return data
                                });

                                dbQ.queryWithArgNoreturn("DELETE FROM `imports` WHERE importNum = ?", oldData.importNum)
                            }, 600);
                        }),
                }}
                icons={tableIcons}
                actions={[
                    {
                        icon: VisibilityIcon,
                        tooltip: 'view',
                        onClick: (event, rowData) => {

                            setHeader(rowData)
                            const returnData = async () => {
                                var result = await dbQ.queryWithArg
                                    (
                                        "SELECT " +
                                        "p.barcode,p.type,p.packet,p.sheet,p.pill,p.cost,p.importNum,p.drugID," +
                                        "i.importID,i.importNum," +
                                        "d.name,d.drugID " +
                                        "FROM products as p INNER JOIN imports as i " +
                                        "ON p.importNum = i.importNum " +
                                        "join drugs as d " +
                                        "ON p.drugID=d.drugID " +
                                        "WHERE i.importNum = ? ",
                                        rowData.importNum
                                    )

                                setImportData(result)
                            }

                            returnData()
                            setOpen(true);
                        }
                    }
                ]}
                options={{
                    headerStyle: {
                        backgroundColor: "#084177",
                        color: '#FFF'
                    },
                    pageSizeOptions: [20, 30, 60],
                    pageSize: 20,
                    addRowPosition: 'first'
                }}
            />

            {/* import detail */}
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="xl" fullWidth={true}>

                {
                    open ?
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: "1%" }}>
                            <Typography variant="h6" gutterBottom>
                                From: {headerData.name}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Cost: {headerData.cost}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Date: {ParseToDate(headerData.date)}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Status: {headerData.status}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Import: {headerData.importNum}
                            </Typography>
                        </div>
                        : null
                }

                <MaterialTable
                    title="Medicines"
                    columns={columnsDetail}
                    data={importData}
                    icons={tableIcons}
                    options={{
                        headerStyle: {
                            backgroundColor: "#084177",
                            color: '#FFF'
                        }
                    }}
                />
                <div style={{ padding: "1%" }}>
                    <Button variant="outlined" color="secondary" size="small">Delete</Button>
                </div>
            </Dialog>

            {/* validation dialog */}
            <Dialog
                open={openValidation}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >

                <DialogTitle id="alert-dialog-title">{"Please Fill All Inputs"}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}
