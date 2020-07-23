import React from 'react';


// metrial ui components
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

// react-route-dom
import {
  useHistory,
} from "react-router-dom";

// copyright ui
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Slaw Pharmacy Copyright © '}        
      {' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

// style
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#52de97",
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

//db 
import db from '../../Backend/db'
var dbQ = new db();


export default function Login() {

  const [username, setUsername] = React.useState();
  const [password, setPassword] = React.useState();
  const [error, setError] = React.useState(false); // used for  empty input validation
  const [wrong, setWrong] = React.useState(false); // if username or password was wrong show error

  let history = useHistory();
  const classes = useStyles();


  const textChange = (event) => {
    setError(false)
    setWrong(false)
    if (event.target.name == 'username')
      setUsername(event.target.value)
    else if (event.target.name == 'password')
      setPassword(event.target.value)
  }

  const LoginBtn = async () => {

    if (username && password) {

      var result = await dbQ.queryWithArg("select u.userID,u.employee,u.username,u.role,p.name,p.pharmacyID from users as u INNER JOIN pharmacies as p on u.employee=p.pharmacyID where username=? and password=? ", [username, password]);

      if (result.length) {

        // all these data used in query
        localStorage.setItem("userID", result[0].userID)
        localStorage.setItem("username", result[0].username)
        localStorage.setItem("role", result[0].role)

        // manager user has to have all pharmacies 
        if (result[0].role == 'Manager') {
          var pharmacies = await dbQ.queryWithArg("select pharmacyID,name from pharmacies where manager = ?", result[0].userID)
          var pharmaciesString = JSON.stringify(pharmacies)
          localStorage.setItem("Pharmacies", pharmaciesString)
          history.push("/drawer/medicine")
        }
        //employee users require only the pharmacyy work at
        else {
          var pharmacies = [{ pharmacyID: result[0].employee }]
          var pharmaciesString = JSON.stringify(pharmacies)
          localStorage.setItem("Pharmacies", pharmaciesString)
          localStorage.setItem("pharmacyID", result[0].employee)
          localStorage.setItem("pharmacyName", result[0].name)
          history.push("/drawer/")
        }

      }
      else {
        setWrong(true)
      }

    }

    else {
      setError(true)
    }

  };

  return (
    <Container component="main" maxWidth="xs" style={{ backgroundColor: "#fff" }}>
      <CssBaseline />

      <div className={classes.paper}>

        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <form className={classes.form} noValidate>

          <TextField
            variant="outlined"
            error={error}
            helperText={error ? "Fill Inputs" : null}
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            onChange={textChange}
          />
          <TextField
            variant="outlined"
            error={error}
            helperText={error ? "Fill Inputs" : null}
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={textChange}
            autoComplete="current-password"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={LoginBtn}
          >
            Login
          </Button>

          {
            wrong ?
              <Typography component="h1" variant="subtitle2" color="secondary">
                Username or Password is wrong
             </Typography>
              : null
          }
        </form>

      </div>

      <Box p={5}>
        <Copyright />
      </Box>

    </Container>
  );
}