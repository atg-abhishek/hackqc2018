import React, { Component } from "react";
import { Grid, Cell } from "react-mdl";
import _ from "lodash";

function sum(arr) {
  return arr.reduce((acc, v) => {
    return acc + v;
  }, 0);
}

export class Leaderboard extends Component {
  render() {
    const users = this.props.users || {};
    const sumByUser = Object.keys(users).reduce((acc, key) => {
      console.log("users[key]", users[key]);
      acc[key] = sum(users[key].entries.map(e => e.lbs));
      return acc;
    }, {});

    return (
      <div style={{ width: "100%", margin: "auto" }}>
        {_.sortBy(Object.entries(sumByUser), ([, weight]) => weight).map(([userId, weight], i) => {
          return (
            <Grid>
              <Cell col={1}>{i + 1}</Cell>
              <Cell col={2}>{users[userId].name}</Cell>
              <Cell col={1}>{weight.toFixed(1)} lbs</Cell>
            </Grid>
          );
        })}
      </div>
    );
  }
}
