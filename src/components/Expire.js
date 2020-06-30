import React, { Component } from 'react';
import { forwardRef } from 'react';

// metrial ui
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MaterialTable from 'material-table';


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


const columns = [
    { title: 'Barcode', field: 'barcode' },
    { title: 'Name', field: 'name' },
    { title: 'Expire ', field: 'expire', type: 'date' },
    { title: 'Packet', field: 'remainPacket' },
    { title: 'Sheet', field: 'remainSheet' },
    { title: 'Pill', field: 'remainPill' },


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

export default class Expire extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedMenu: "Expire",
            Az: false
        };
    }

    componentDidMount() {
        this.returnExpires();
    }

    compareDate() {
        return !this.state.AZ ? "<" : ">"
    }

    limtRow(){
        return !this.state.AZ ? " " : " Limit 100"
    }

    async returnExpires() {

        var result = await dbQ.queryWithArg(
            " SELECT" +
            " p.barcode," +
            " p.expire," +
            " p.remainPacket," +
            " p.remainSheet," +
            " p.remainPill," +
            " p.drugID," +
            " d.drugID," +
            " d.name" +
            " FROM" +
            " products AS p" +
            " INNER JOIN drugs AS d" +
            " ON" +
            " p.drugID = d.drugID" +
            " WHERE" +
            " p.expire " + this.compareDate() +"CURRENT_DATE AND p.remainPacket != 0 and p.pharmacyID =? " +
            " ORDER BY `p`.`expire` DESC"+ this.limtRow(),
            this.props.pharmacyID
        )
        
        this.setState({ data: result })
    };

    render() {

        const handleChange = async (event) => {
            await event.target.value == 'Expire' ? this.setState({ AZ: false, selectedMenu: "Expire" }) : this.setState({ AZ: true, selectedMenu: "A-Z" })
            this.returnExpires()
        };

        return (
            <div>

                <FormControl variant="outlined" style={{ marginBottom: "1%" }} size="small">
                    <Select value={this.state.selectedMenu} onClick={handleChange}>
                        <MenuItem value="Expire">Expire</MenuItem>
                        <MenuItem value="A-Z">A-Z</MenuItem>
                    </Select>
                </FormControl>


                <MaterialTable
                    title="Expire"
                    columns={columns}
                    data={this.state.data}
                    icons={tableIcons}
                    options={{
                        headerStyle: {
                            backgroundColor: "#084177",
                            color: '#FFF'
                        },
                        pageSizeOptions: [10, 20, 30],
                        pageSize: 10
                    }}
                />

            </div>
        );
    }
}
