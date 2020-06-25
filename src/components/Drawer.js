import React from 'react';

//material ui
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import { createMuiTheme } from '@material-ui/core/styles';


//icon
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import LocalHospitalOutlinedIcon from '@material-ui/icons/LocalHospitalOutlined';
import AccountBoxOutlinedIcon from '@material-ui/icons/AccountBoxOutlined';
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import BusinessCenterOutlinedIcon from '@material-ui/icons/BusinessCenterOutlined';



import {
  Route,
  Link,
  useHistory
} from "react-router-dom";


//pages 
import Home from './Home'
import Bills from './Bills'
import Stock from './Stock'
import Imports from './Imports'
import Report from './Report'
import Medicine from './Drugs'
import Users from './Users'
import Companies from './Companies'
import PharmaciesReport from './PharmaciesReport'
import PharmaciesUser from './PharmaciesUser'




const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: "#fff"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "#00bfa5"
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    backgroundColor: "#fff"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: "#fff"
  },
  link: {
    textDecoration: "none",
    color: 'black'
  },

}));

export default function DrawerPage() {

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [isManager, setisManager] = React.useState(false)

  React.useEffect(() => {
    var role = localStorage.getItem("role")
    if (role == "Manager")
      setisManager(true)
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const isActive = (value) => {
    if (location.hash == value)
      return true
    else
      return false

  };

  let history = useHistory();

  const logout = () => {
    localStorage.removeItem('userID')
    localStorage.removeItem('pharmacyID')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    localStorage.removeItem('Pharmacies')

    history.push('/login')

  }


  const ManagerLinks = () => {
    if (isManager) {
      return (
        <div>
          <Link to="/drawer/report" className={classes.link}>
            <ListItem button key="Report" selected={isActive('#/drawer/report')}>
              <ListItemIcon> <DashboardOutlinedIcon /> </ListItemIcon>
              <ListItemText primary="Report" />
            </ListItem>
          </Link>
          <Link to="/drawer/insights" className={classes.link}>
            <ListItem button key="Insights" selected={isActive('#/drawer/insights')}>
              <ListItemIcon> <BarChartOutlinedIcon /> </ListItemIcon>
              <ListItemText primary="Insights" />
            </ListItem>
          </Link>
          <Link to="/drawer/users" className={classes.link}>
            <ListItem button key="Users" selected={isActive('#/drawer/users')}>
              <ListItemIcon> <AccountBoxOutlinedIcon /> </ListItemIcon>
              <ListItemText primary="Pharmacy" />
            </ListItem>
          </Link>
          <Link to="/drawer/backup" className={classes.link}>
            <ListItem button key="Backup" selected={isActive('#/drawer/backup')}>
              <ListItemIcon> <CloudUploadOutlinedIcon /> </ListItemIcon>
              <ListItemText primary="Backup" />
            </ListItem>
          </Link>
        </div>
      )
    }
  }

  const CashierLinks = () => {
    if (!isManager) {
      return (
        <div>
          <Link to="/drawer/" className={classes.link}>
            <ListItem button key="Home" selected={isActive('#/drawer/')}  >
              <ListItemIcon> <HomeOutlinedIcon />  </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </Link>

          <Link to="/drawer/stock" className={classes.link}>
            <ListItem button key="Stock" selected={isActive('#/drawer/stock')}  >
              <ListItemIcon> <ListAltOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Stock" />
            </ListItem>
          </Link>

          <Link to="/drawer/bills" className={classes.link}>
            <ListItem button key="Bills" selected={isActive('#/drawer/bills')}  >
              <ListItemIcon> <BookOutlinedIcon />  </ListItemIcon>
              <ListItemText primary="Bills" />
            </ListItem>
          </Link>
        </div>
      )
    }
  }

  return (
    <div className={classes.root}>

      <CssBaseline />

      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
            Slaw Pharmacy
          </Typography>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>

        <Divider />

        <List>
          {CashierLinks()}
          
          <Link to="/drawer/medicine" className={classes.link}>
            <ListItem button key="Medicine" selected={isActive('#/drawer/medicine')}>
              <ListItemIcon> <LocalHospitalOutlinedIcon /> </ListItemIcon>
              <ListItemText primary="Medicine" />
            </ListItem>
          </Link>

          <Link to="/drawer/imports" className={classes.link}>
            <ListItem button key="Import" selected={isActive('#/drawer/imports')}>
              <ListItemIcon> <ArchiveOutlinedIcon /> </ListItemIcon>
              <ListItemText primary="Imports" />
            </ListItem>
          </Link>

          <Link to="/drawer/companies" className={classes.link}>
            <ListItem button key="Compnaies" selected={isActive('#/drawer/companies')}>
              <ListItemIcon> <BusinessCenterOutlinedIcon /> </ListItemIcon>
              <ListItemText primary="Companies" />
            </ListItem>
          </Link>

          {ManagerLinks()}
        </List>

      </Drawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Route path="/drawer/" exact component={Home} />
        <Route path="/drawer/bills" exact component={Bills} />
        <Route path="/drawer/stock" exact component={Stock} />
        <Route path="/drawer/imports" exact component={Imports} />
        <Route path="/drawer/report" exact component={PharmaciesReport} />
        <Route path="/drawer/medicine" exact component={Medicine} />
        <Route path="/drawer/users" exact component={PharmaciesUser} />
        <Route path="/drawer/companies" exact component={Companies} />

      </main>

    </div >
  );
}

