import React from 'react';
import { forwardRef } from 'react';

//metrial ui
import MaterialTable,{ MTableToolbar }  from 'material-table';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

// icons
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
import RefreshIcon from '@material-ui/icons/Refresh';


//db 
import db from '../../Backend/db'
var dbQ = new db();

// store data 
const Store = require('electron-store');
const store = new Store();

export default function Stock() {

    const [stockData, setStock] = React.useState();
    const [open, setOpen] = React.useState(false);
    const [pharmacyID, setPharmacyID] = React.useState();

    React.useEffect(() => {
        if (!store.get("stock")) {
            var result = dbQ.query("SELECT p.productID, p.drugID, p.importNum, p.barcode, p.cost, p.price, p.expire, p.type, p.remainPacket, p.remainSheet, p.remainPill,d.name,d.drugID FROM products as p INNER JOIN drugs as d ON p.drugID=d.drugID")
            setStock(result)
            store.set("stock", result)
        }
        else {
            setStock(store.get("stock"))   
        }
        setPharmacyID(localStorage.getItem('pharmacyID'))
    }, []);


    const columns = [
        { title: 'Barcode', field: 'barcode' },
        { title: 'Name', field: 'name', editable: "never" },
        { title: 'Type', field: 'type', editComponent: props => (ListTypes(props)) },
        { title: 'Price', field: 'price', type: "numeric" },
        { title: 'Cost ', field: 'cost', type: "numeric" },
        { title: 'Expire ', field: 'expire', type: 'date' },
        { title: 'Packet ', field: 'remainPacket', type: "numeric" },
        { title: 'Sheet ', field: 'remainSheet', type: "numeric" },
        { title: 'Pill ', field: 'remainPill', type: "numeric" },
        { title: 'Import ', field: 'importNum', type: "numeric" },
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
    }

    const AddLastOne = () => {

        var result = dbQ.query("SELECT p.productID, p.drugID, p.importNum, p.barcode, p.cost, p.price, p.expire, p.type, p.remainPacket, p.remainSheet, p.remainPill,d.name,d.drugID FROM products as p INNER JOIN drugs as d ON p.drugID=d.drugID ORDER BY p.productID DESC  limit 1 ")

        setStock((prevState) => {
            const data = [...prevState];
            data.push(result[0]);
            store.set("stock", data)
            return data
        });

    }

    const types = [
        { type: "Pill" },
        { type: "Injection" },
        { type: "liquid" },
        { type: "Cream" },
        { type: "Tool" }
    ]

    function ListTypes(props) {
        return (
            <Autocomplete
                id="tags-standard"
                style={{ width: 150 }}
                size="small"
                fullWidth={true}
                options={types}
                getOptionLabel={(types) => types.type}
                onChange={(event, value) => value && props.onChange(value.type)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        placeholder="Type"
                        size="small"
                    />
                )}
            />
        )
    }

    const [selectedRow, setSelectedRow] = React.useState(null);

    return (
        <div>

            <MaterialTable
                title="Stock"
                columns={columns}
                data={stockData}
                options={{
                    pageSizeOptions: [20, 30, 60],
                    pageSize: 20,
                    addRowPosition: 'first'
                }}
                editable={{
                    onRowAdd: (newData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                if (Object.keys.length < 11) {
                                    resolve();

                                    // setStock((prevState) => {
                                    //     const data = [...prevState];
                                    //     data.push(newData);
                                    //     return data
                                    // });


                                    var packet = newData.remainPacket
                                    var sheet = newData.remainSheet
                                    var pill = newData.remainPill

                                    var totalSheet = packet * sheet;
                                    var totalPill = totalSheet * pill;

                                    const insert = async () => {
                                        await dbQ.queryWithArgNoreturn(
                                            "INSERT INTO `products`(`drugID`, `pharmacyID`,`importNum`, `barcode`, `cost`, `price`, `expire`, `type`, `packet`, `sheet`, `pill`, `remainPacket`, `remainSheet`, `remainPill`,`sheetPerPacket`,`pillPerSheet`) " +
                                            " VALUES ((select drugID from drugs where barcode=?),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                                            [newData.barcode, pharmacyID, newData.importNum, newData.barcode, newData.cost, newData.price, newData.expire, newData.type, packet, totalSheet, totalPill, packet, totalSheet, totalPill, sheet, pill]
                                        )

                                    }

                                    insert()
                                    AddLastOne()
                                }
                                else {
                                    resolve();
                                    setOpen(true);
                                }

                            }, 600);
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                if (oldData) {
                                    if (Object.keys.length < 11) {
                                        setStock((prevState) => {
                                            const data = [...prevState];
                                            data[data.indexOf(oldData)] = newData;
                                            store.set("stock", data)
                                            return data
                                        });

                                        var packet = newData.remainPacket
                                        var sheet = newData.remainSheet
                                        var pill = newData.remainPill

                                        var totalSheet = packet * sheet;
                                        var totalPill = totalSheet * pill;

                                        dbQ.queryWithArgNoreturn("UPDATE `products` SET `drugID`=(select drugID from drugs where barcode=?), `importNum`=?,`barcode`=?,`cost`=?,`price`=?,`expire`=?,`type`=?,`packet`=?, `sheet`=?, `pill`=?, `remainPacket`=?, `remainSheet`=?, `remainPill`=?,sheetPerPacket=?,pillPerSheet=? WHERE productID=?",
                                            [newData.barcode, newData.importNum, newData.barcode, newData.cost, newData.price, newData.expire, newData.type, packet, totalSheet, totalPill, packet, totalSheet, totalPill, sheet, pill, oldData.productID]
                                        )
                                    }
                                    else
                                        setOpen(true);
                                }
                            }, 600);
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                setStock((prevState) => {
                                    const data = [...prevState];
                                    data.splice(data.indexOf(oldData), 1);
                                    store.set("stock", data)
                                    return data
                                });
                                dbQ.queryWithArgNoreturn("DELETE FROM `products` WHERE productID=?", oldData.productID)
                            }, 600);
                        }),
                }}
                icons={tableIcons}
                options={{
                    headerStyle: {
                        backgroundColor: "#084177",
                        color: '#FFF'
                    },
                    addRowPosition: 'first',
                    pageSizeOptions: [20, 30, 60],
                    pageSize: 20,
                    exportAllData: true,
                    exportButton: true,
                    rowStyle: rowData => ({
                        backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
                    })
                }}
                onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
                components={{
                    Toolbar: props => (
                        <div>
                          <MTableToolbar {...props} />
                          <div style={{padding: '0px 0px 0px 18px',marginBottom:"1%"}}>
                            <Button
                            size="small"
                            variant="contained" 
                            color="primary"
                            startIcon={<RefreshIcon />}
                            >Refresh</Button>
                          </div>
                        </div>
                      ),
                  }}
            />

            {/* validation dialog */}
            <Dialog
                open={open}
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
