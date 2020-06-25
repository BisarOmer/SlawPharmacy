import React from 'react';
import { forwardRef } from 'react';

//metrial ui
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Skeleton from '@material-ui/lab/Skeleton';
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


//db 
import db from '../../Backend/db'
var dbQ = new db();

export default function Drugs() {

    const [data, setData] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [loaded,setload]=React.useState(false);

    const columns = [
        // { title: 'Drug ID ', field: 'drugID',editable:'never' },
        { title: 'Barcode', field: 'barcode', type: 'numeric' },
        { title: 'Name', field: 'name' },
        { title: 'Scintific Name', field: 'scintificName' },
        { title: 'Indication ', field: 'indication' },
        { title: 'Side Effect ', field: 'sideEffect' },
        { title: 'Content', field: 'content' },
    ]

    React.useEffect(() => {
        var result = dbQ.query("select * from drugs")
        setData(result)
        setload(true)

    }, []);

    const handleClose = () => {
        setOpen(false);
      };

    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear  {...props} ref={ref} />),
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

    return (
        <div>
        {
        loaded?<MaterialTable
            title="Medicine"
            columns={columns}
            data={data}
            editable={{
                onRowAdd: (newData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            if (Object.keys(newData).length == 6) {
                                resolve();
                                setData((prevState) => {
                                    const data = [...prevState];
                                    data.push(newData);
                                    return data
                                });
                                dbQ.queryWithArgNoreturn("INSERT INTO `drugs` (`barcode`, `name`, `scintificName`, `indication`, `sideEffect`, `content`)  VALUES (?,?,?,?,?,?)",
                                    [parseInt(newData.barcode), newData.name, newData.scintificName, newData.indication, newData.sideEffect, newData.content]);
                            }
                            else{
                                setOpen(true)
                                resolve();
                            }

                        }, 600);
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            if (oldData) {
                                setData((prevState) => {
                                    const data = [...prevState];
                                    data[data.indexOf(oldData)] = newData;
                                    return data
                                });
                                dbQ.queryWithArgNoreturn("UPDATE `drugs` SET  `barcode`=?,`name`=?,`scintificName`=?,`indication`=?,`sideEffect`=?,`content`=?  WHERE drugID=?",
                                    [parseInt(newData.barcode), newData.name, newData.scintificName, newData.indication, newData.sideEffect, newData.content, oldData.drugID])
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
                                return data;
                            });
                            dbQ.queryWithArgNoreturn("DELETE FROM `drugs` WHERE drugID =?", oldData.drugID)
                        }, 600);
                    }),
            }}
            icons={tableIcons}
            options={{
                headerStyle: {
                    backgroundColor: "#084177",
                    color: '#FFF'
                },
                pageSizeOptions:[20,30,60],
                pageSize:20
            }}
        />:<Skeleton animation="wave" />
        }

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
