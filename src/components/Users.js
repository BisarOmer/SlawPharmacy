import React, { useState } from 'react';
import { forwardRef } from 'react';

//metrial ui
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

//icon
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

export default function Users(props) {


    const [usersData, setUsers] = React.useState();
    const [open, setOpen] = React.useState(false);
    const [userID, setuserID] = React.useState();
    const PharmacyID=props.pharmacyID;


    React.useEffect(() => {
        fetchUsers()
    }, []);

    const fetchUsers = async () => {
        var result = await dbQ.queryWithArg(
            "SELECT users.userID, users.employee, users.username, users.password, users.role, pharmacies.name, pharmacies.pharmacyID FROM users " +
            " INNER JOIN pharmacies ON users.employee= pharmacies.pharmacyID where  pharmacies.pharmacyID =? ",
            PharmacyID)

        setUsers(result)
        setuserID(localStorage.getItem("userID"))
    }

    const AddLastOne = () => {

        var result = dbQ.query
            ("SELECT users.userID, users.employee, users.username, users.password, users.role, pharmacies.name, pharmacies.pharmacyID FROM users " +
                " INNER JOIN pharmacies ON users.employee= pharmacies.pharmacyID where  pharmacies.pharmacyID =? ORDER BY users.userID DESC LIMIT 1 ")

        setUsers((prevState) => {
            const data = [...prevState];
            data.push(result[0]);
            return data
        });

    }


        const columns = [
            { title: 'Pharmacy', field: 'name', editable: "never" },
            { title: 'Username', field: 'username' },
            { title: 'Password', field: 'password' },
            { title: 'Role', field: 'role', editComponent: props => (ListRole(props)) },
        ]

        const Roles = [
            { value: 'Cashier' },
            { value: "Manager" }
        ]

        function ListRole(props) {
            return (
                <Autocomplete
                    id="tags-standard"
                    style={{ width: 150 }}
                    size="small"
                    fullWidth={true}
                    options={Roles}
                    getOptionLabel={(Roles) => Roles.value}
                    onChange={(event, value) => value && props.onChange(value.value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            placeholder="Role"
                            size="small"
                        />
                    )}
                />
            )
        }

        const handleClose = () => {
            this.setState({ open: false })
        };

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

        return (
            <div>

                <MaterialTable
                    title="Users"
                    columns={columns}
                    data={usersData}
                    editable={{
                        onRowAdd: (newData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    if (Object.keys(newData).length == 3) {
                                        resolve();

                                        dbQ.queryWithArgNoreturn("INSERT INTO `users`(`employee`, `username`, `password`, `role`) VALUES (?,?,?,?)",
                                            [PharmacyID, newData.username, newData.password, newData.role]
                                        )

                                        AddLastOne()
                                    }
                                    else {
                                        this.setState({ open: true })
                                        resolve();
                                    }
                                }, 600);
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {

                                    if (Object.keys(newData).length >= 2) {
                                        resolve();
                                        if (oldData) {

                                            setUsers((prevState) => {
                                                const data = [...prevState];
                                                data[data.indexOf(oldData)] = newData;
                                                return  data
                                            });

                                            dbQ.queryWithArgNoreturn("UPDATE `users` SET `username`=?,`password`=?,`role`=? WHERE userID=? and employee =?",
                                                [newData.username, newData.password, newData.role, oldData.userID, PharmacyID]
                                            )
                                        }
                                    }
                                    else {
                                        this.setState({ open: true })
                                        resolve();
                                    }
                                }, 600);
                            }),
                        onRowDelete: (oldData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    if (oldData.userID != userID) {
                                        resolve();
                                        setUsers((prevState) => {
                                            const data = [...prevState];
                                            data.splice(data.indexOf(oldData), 1);
                                            return data
                                        });
                                        dbQ.queryWithArgNoreturn("DELETE FROM `users` WHERE userID=? and pharmacyID = ?",
                                            [oldData.userID, PharmacyID]
                                        )
                                    }
                                    else
                                        resolve();
                                }, 600);
                            }),
                    }}
                    icons={tableIcons}
                    options={{
                        headerStyle: {
                            backgroundColor: "#084177",
                            color: '#FFF'
                        }
                    }}
                />

                {/* empty input validation dialog */}
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
