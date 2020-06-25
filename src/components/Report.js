import React from 'react';

//meateral ui
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

//tabs
import Expire from './Expire'
import OutosStock from './OutofStock'
import Dashboard from './Dashboard'



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
        <Box pt={3} >
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

export default function Report(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  // const [Pharmacies, setPharmacies] = React.useState([]);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(()=>{
    // setPharmacies(JSON.parse(localStorage.getItem("Pharmacies")))
    console.log(props.pharmacyID);
    
  })

  return (
    <div className={classes.root}>

      <Paper position="static" >
        <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Dashboard" {...a11yProps(0)} />
          <Tab label="Expire" {...a11yProps(1)} />
          <Tab label="Out of stock" {...a11yProps(2)} />
        </Tabs>
      </Paper>

      <TabPanel value={value} index={0}>
        <Dashboard pharmacyID={props.pharmacyID}/>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Expire pharmacyID={props.pharmacyID}/>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <OutosStock pharmacyID={props.pharmacyID}/>
      </TabPanel>

    </div>
  );
}
