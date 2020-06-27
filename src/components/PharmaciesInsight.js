import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


import Insight from './Insight'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box pt={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function PharmaciesInsights() {

    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [Pharmacies, setPharmacies] = React.useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    React.useEffect(() => {
        setPharmacies(JSON.parse(localStorage.getItem("Pharmacies")))
    }, [])

    return (
        <div className={classes.root}>
          
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" scrollButtons="auto">
                    {Pharmacies.map(pharmacy => { return (<Tab key={pharmacy.name} label={pharmacy.name} {...a11yProps(pharmacy.pharmacyID)} />) })}
                </Tabs>
            

            {
                 Pharmacies.map((item,index) => { 
                  return (<TabPanel key={item.name} value={value} index={index}> <Insight pharmacyID={item.pharmacyID} /> </TabPanel>) 
                }) 
            }


        </div>
    );
}
