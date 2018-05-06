import React, { Component } from "react";
import { DataTable, TableHeader, Grid, Cell } from "react-mdl";
import _ from "lodash";

import { fetch } from "./fetch";

function sum(arr) {
  return arr.reduce((acc, v) => {
    return acc + v;
  }, 0);
}

function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

export class StatsDashboard extends Component {
  render() {
    const { city: cityData = {}, municipality: municipalityData } = this.props.cityData || {};
    const mainUser = this.props.mainUser || {};

    const weightFormatter = weight => `${(weight || 0).toFixed(1)} lbs`;

    return (
      <div className="App">
        <Grid>
          <h5>Comparaison</h5>
          <Cell col={12} className="stats-grid">
            <DataTable
              shadow={0}
              rows={[
                {
                  time_range: "Cette semaine",
                  city_consumption: cityData.this_week,
                  municipality_consumption: municipalityData.this_week,
                  me: sum((mainUser.entries || []).map(e => e.lbs)),
                  performance: sum((mainUser.entries || []).map(e => e.lbs)) - cityData.this_week
                },
                {
                  time_range: "Semaine passée",
                  me: 11,
                  municipality_consumption: municipalityData.last_week,
                  city_consumption: cityData.last_week,
                  performance: 11 - cityData.last_week
                },
                {
                  time_range: "Ce mois",
                  me: 50,
                  municipality_consumption: municipalityData.month,
                  city_consumption: cityData.month,
                  performance: 50 - cityData.month
                },
                {
                  time_range: "Cette année",
                  me: 540,
                  municipality_consumption: municipalityData.year,
                  city_consumption: cityData.year,
                  performance: 540 - cityData.year
                }
              ]}
            >
              <TableHeader name="time_range" />
              <TableHeader
                name="me"
                tooltip="Ta consommation"
                cellFormatter={weight => `${(weight || 0).toFixed(2)} lbs`}
              >
                Moi
              </TableHeader>
              <TableHeader name="city_consumption" tooltip="Ta consommation" cellFormatter={weightFormatter}>
                Ma ville
              </TableHeader>
              {Object.keys(municipalityData).length !== 0 && (
                <TableHeader
                  numeric
                  name="municipality_consumption"
                  tooltip="Municipalité"
                  cellFormatter={weightFormatter}
                >
                  Municipalité
                </TableHeader>
              )}
              <TableHeader numeric name="performance" cellFormatter={p => p.toFixed(2)} tooltip="Performance">
                Performance
              </TableHeader>
            </DataTable>
          </Cell>
        </Grid>
        <Grid>
          <Cell col={12}>
            <h5>Entrées récentes</h5>
          </Cell>
          <Cell col={12} style={{ marginRight: "5px" }}>
            <DataTable
              shadow={0}
              rows={_.orderBy(mainUser.entries || [], e => e.date, ["desc"]).map(e => {
                return { ...e, date: formatDate(e.date), lbs: (e.lbs || 0).toFixed(1) };
              })}
            >
              <TableHeader name="date">Date</TableHeader>
              <TableHeader name="lbs">Poids</TableHeader>
              <TableHeader name="deviceLabel">Appareil</TableHeader>
            </DataTable>
          </Cell>
        </Grid>
      </div>
    );
  }
}
