import React, { Component } from "react";
import { Grid, Cell } from "react-mdl";

export class Leaderboard extends Component {
  render() {
    return (
      <div style={{ width: "100%", margin: "auto" }}>
        <Grid>
          <Cell col={1}>1er</Cell>
          <Cell col={2}>Bryan Cranston</Cell>
          <Cell col={1}>50 lbs</Cell>
        </Grid>
        <Grid>
          <Cell col={1}>2e</Cell>
          <Cell col={2}>Bryan Cranston</Cell>
          <Cell col={1}>50 lbs</Cell>
        </Grid>
        <Grid>
          <Cell col={1}>3e</Cell>
          <Cell col={2}>Bryan Cranston</Cell>
          <Cell col={1}>50 lbs</Cell>
        </Grid>
      </div>
    );
  }
}
