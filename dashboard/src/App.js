import React, { Component } from "react";
import "./App.css";
import "react-mdl/extra/material.css";
import "react-mdl/extra/material.js";
import { Layout, Header, HeaderRow, HeaderTabs, Tab, Drawer, Content, RadioGroup, Radio, Snackbar } from "react-mdl";
import { default as Upload } from "rc-upload";

import { StatsDashboard } from "./StatsDashboard";
import { Leaderboard } from "./Leaderboard";
import { fetch } from "./fetch";
import { dataForCity } from "./data";

const SNACKBAR_TIMEOUT = 5000;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      city: "Agglomération de Montréal",
      selected_city: "montreal"
    };

    this.numFriendsResults = undefined;
    this.numMainUserResults = undefined;
  }

  renderContent() {
    switch (this.state.activeTab) {
      case 0:
        return <StatsDashboard {...this.getData()} />;
      default:
        return <Leaderboard {...this.getData()} />;
    }
  }

  componentDidMount() {
    this.fetchEntries();

    setInterval(() => {
      this.fetchEntries();
    }, 1000);
  }

  fetchEntries() {
    console.log("fetchEntries");
    fetch().then(users => {
      const newCount = users ? users[2].entries.length + users[3].entries.length + users[4].entries.length : 0;
      const newMainUserCount = users ? users[1].entries.length : 0;

      console.log("new count", newCount);
      if (this.numFriendsResults !== undefined) {
        if (newCount > this.numFriendsResults) {
          this.setState({ newData: true });
          setTimeout(() => {
            this.setState({ newData: false });
          }, SNACKBAR_TIMEOUT);
        }
      }

      if (this.numMainUserResults !== undefined) {
        if (newMainUserCount > this.numMainUserResults) {
          this.setState({ newMainUserData: true });
          setTimeout(() => {
            this.setState({ newMainUserData: false });
          }, SNACKBAR_TIMEOUT);
        }
      }

      this.numFriendsResults = newCount;
      this.numMainUserResults = newMainUserCount;
      console.log(users);
      this.setState({ users });
    });
  }

  getData() {
    return {
      cityData: dataForCity({ city: this.state.selected_city, municipality: this.state.municipality || "Sud-Ouest" }),
      users: this.state.users,
      mainUser: this.state.users && this.state.users[1]
    };
  }

  selectCity(e) {
    this.setState({ selected_city: e.target.value });
  }

  render() {
    return (
      <div>
        <Layout fixedHeader>
          <Drawer title="Paramètres">
            <div style={{ paddingLeft: "20px" }}>
              <h6>Votre ville</h6>
              <RadioGroup name="city_picker" value={this.state.selected_city} onChange={this.selectCity.bind(this)}>
                <Radio value="montreal">Montreal</Radio>
                <br />
                <Radio value="laval">Laval</Radio>
                <br />
                <Radio value="opt2" disabled={true}>
                  Gatineau (à venir)
                </Radio>
              </RadioGroup>

              {this.state.selected_city === "montreal" && (
                <div>
                  <div>Municipalité</div>
                  <select disabled={true}>
                    <option selected={true}>Sud-Ouest</option>
                  </select>
                </div>
              )}
            </div>
            <div style={{ paddingLeft: "20px" }}>
              <h6>Image</h6>
              <div>
                <Upload
                  name="img"
                  action="https://b2f6afdd.ngrok.io/predict"
                  onSuccess={function(...args) {
                    console.log(...args);
                  }}
                >
                  Téleverser
                </Upload>
              </div>
            </div>
          </Drawer>
          <Header scroll>
            <HeaderRow title="Eco³" hideSpace={true}>
              {/* <img
                style={{ marginLeft: "50px", position: "absolute", width: "50px", height: "50px" }}
                src={require("./image.png")}
              /> */}
            </HeaderRow>
            <HeaderTabs
              ripple
              activeTab={this.state.activeTab}
              onChange={tabId =>
                this.setState({
                  activeTab: tabId
                })
              }
            >
              <Tab>Tableau de Bord</Tab>
              <Tab>Classement</Tab>
            </HeaderTabs>
          </Header>
          <Content>
            <div className="page-content">{this.renderContent()}</div>
          </Content>
        </Layout>
        <Snackbar active={this.state.newData} timeout={SNACKBAR_TIMEOUT}>
          Nouvelle entrée d'un ami!
        </Snackbar>
        <Snackbar active={this.state.newMainUserData} timeout={SNACKBAR_TIMEOUT}>
          Nouvelle entrée reçue!
        </Snackbar>
      </div>
    );
  }
}

export default App;
