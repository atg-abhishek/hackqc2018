import React, { Component } from "react";
import { DataTable, TableHeader, Grid, Cell } from "react-mdl";

export class StatsDashboard extends Component {
  render() {
    return (
      <div className="App">
        <Grid className="stats-grid">
          <Cell col={12}>
            <h5>Comparaison</h5>
            <DataTable
              shadow={0}
              rows={[
                {
                  time_range: "Cette semaine",
                  city_consumption: "50 lbs",
                  quebec_consumption: "50 lbs",
                  me: "50 lbs"
                },
                {
                  time_range: "Semaine passée",
                  me: "60 lbs",
                  quebec_consumption: "50 lbs",
                  city_consumption: "50 lbs"
                },
                {
                  time_range: "Ce mois",
                  me: "50 lbs",
                  quebec_consumption: "50 lbs",
                  city_consumption: "50 lbs"
                },
                {
                  time_range: "Cette année",
                  me: "50 lbs",
                  quebec_consumption: "50 lbs",
                  city_consumption: "50 lbs"
                }
              ]}
            >
              <TableHeader name="time_range" />
              <TableHeader name="me" tooltip="Ta consommation">
                Moi
              </TableHeader>
              <TableHeader name="city_consumption" tooltip="Ta consommation">
                Ma ville
              </TableHeader>
              <TableHeader
                numeric
                name="quebec_consumption"
                tooltip="Consommation au québec"
              >
                Québec
              </TableHeader>
              <TableHeader numeric name="performance" tooltip="Performance">
                Performance
              </TableHeader>
            </DataTable>
          </Cell>
        </Grid>
        <Grid>
          <Cell col={12}>
            <h5>Entrées récentes</h5>
          </Cell>
          <Cell col={12}>
            <DataTable
              shadow={0}
              rows={[
                { date: "2018-01-01", weight: "50 lbs", device: "Salon" },
                { date: "2018-01-01", weight: "50 lbs", device: "Salon" },
                { date: "2018-01-01", weight: "50 lbs", device: "Salon" },
                { date: "2018-01-01", weight: "50 lbs", device: "Salon" },
                { date: "2018-01-01", weight: "50 lbs", device: "Salon" }
              ]}
            >
              <TableHeader name="date" />
              <TableHeader name="weight" tooltip="Ta consommation">
                Weight
              </TableHeader>
              <TableHeader name="device" tooltip="Ta consommation">
                Appareil
              </TableHeader>
            </DataTable>
          </Cell>
        </Grid>
      </div>
    );
  }
}
