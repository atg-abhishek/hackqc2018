import React, { Component } from "react";
import "./App.css";
import "react-mdl/extra/material.css";
import "react-mdl/extra/material.js";
import {
  Layout,
  Header,
  HeaderRow,
  HeaderTabs,
  Tab,
  Drawer,
  Content,
  RadioGroup,
  Radio
} from "react-mdl";

import { StatsDashboard } from "./StatsDashboard";
import { Leaderboard } from "./Leaderboard";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 0 };
  }

  renderContent() {
    switch (this.state.activeTab) {
      case 0:
        return <StatsDashboard />;
      default:
        return <Leaderboard />;
    }
  }

  render() {
    return (
      <div>
        <Layout fixedHeader>
          <Drawer title="Paramètres">
            <div style={{ paddingLeft: "20px" }}>
              <h6>Votre ville</h6>
              <RadioGroup name="demo2" value="opt2">
                <Radio value="opt2">Montreal</Radio>
                <br />
                <Radio value="opt2">Laval</Radio>
                <br />
                <Radio value="opt2">Gatineau</Radio>
              </RadioGroup>
            </div>
          </Drawer>
          <Header scroll>
            <HeaderRow title="Eco³" />
            <HeaderTabs
              ripple
              activeTab={this.state.activeTab}
              onChange={tabId => this.setState({ activeTab: tabId })}
            >
              <Tab>Tableau de Bord</Tab>
              <Tab>Classement</Tab>
            </HeaderTabs>
          </Header>
          <Content>
            <div className="page-content">{this.renderContent()}</div>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default App;
