import React, { Component } from 'react';

import { DatePicker, MuiPickersUtilsProvider, } from '@material-ui/pickers';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'Recharts';

//db 
import db from '../../Backend/db'
var dbQ = new db();

export default class Analytics extends Component {

  constructor(props) {
    super(props)
    this.state = {
      year: new Date(),
      MonthlyData: [],
      MostImports: [],
      loaded: false,
    };
    this.handleYearChange = this.handleYearChange.bind(this);
  }

  componentDidMount() {
    this.fetchData()
  }

  async fetchData() {
    var MostImportsReturn = await dbQ.queryWithArg("SELECT COUNT(i.importID) as Imports , c.name from imports as i INNER JOIN companies as c ON i.from = c.companyID WHERE i.pharmacyID = ? GROUP BY i.from  ORDER BY Imports DESC LIMIT 15",
      this.props.pharmacyID)

    var MonthlyDataReturn = await dbQ.queryWithArg("SELECT SUM(totalPrice)-SUM(totalCost) AS Profit , SUM(totalPrice) AS Total,MONTH(date) as Month FROM bills WHERE pharmacyID = ? and YEAR(date)=? GROUP by MONTH(date)", [this.props.pharmacyID,this.state.year.getFullYear()])

    this.setState({ MostImports: MostImportsReturn, MonthlyData: MonthlyDataReturn, loaded: true })
  }

  handleYearChange(date) {
    this.setState({ year: date });
    this.fetchData();
  }


  render() {
    return (
      <div>
        <Typography variant="h6" gutterBottom>
          Yearly Report
      </Typography>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            views={["year"]}
            label="Year"
            value={this.state.year}
            onChange={this.handleYearChange}
            animateYearScrolling
          />
        </MuiPickersUtilsProvider>

        {
          this.state.loaded ?
            <BarChart
              width={1080}
              height={400}
              data={this.state.MonthlyData}
              margin={{
                top: 40, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Total" fill="#318fb5" />
              <Bar dataKey="Profit" fill="#82ca9d" />
            </BarChart>
            :
            null
        }


        <Typography variant="h6" gutterBottom>
          Most Import From
      </Typography>

        {
          this.state.loaded ?
            <BarChart
              width={1080}
              height={400}
              data={this.state.MostImports}
              margin={{
                top: 40, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Imports" fill="#f3c623" />
            </BarChart>
            :
            null
        }


      </div>
    );
  }
}
