import React, { Component } from "react";
import { auth, db } from "./Auth";
import "./App.css";

class App extends Component {
  state = {
    businessName: "",
    bID: "",
    tier: "",
    dateCreated: "",
    companyData: ""
  };

  componentDidMount = () => {
    let companyData = [];
    auth.onAuthStateChanged(user => {
      db.ref(`companies`)
        .once("value", snap => {
          let x = snap.val();
          let entries = Object.entries(x);
          companyData.push(entries);
        })
        .then(() => this.setState({ companyData }));
    });
  };

  renderCompanyData = () => {
    let { companyData } = this.state;
    return companyData[0].map(item => {
      return (
        <tr key={item[0]}>
          <td className="col-sm-4">{item[1].name}</td>
          <td className="col-sm-4">{item[0]}</td>
          <td className="col-sm-2">{item[1].tier}</td>
          <td className="col-sm-2">{this.state.date}</td>
        </tr>
      );
    });
  };

  render() {
    if (!this.state.companyData) {
      return <h1>Loading...</h1>;
    }
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="navbar-header navbar-left">
            <a className="navbar-brand">Client List</a>
          </div>
          <form
            className="navbar-form navbar-right navbar-search"
            role="search"
          >
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
              />
            </div>
            <button type="submit" className="btn btn-info ">
              Submit
            </button>
          </form>
        </nav>
        <table className="table table-bordered table-dark">
          <thead>
            <tr>
              <th scope="col">Company Name</th>
              <th scope="col">Company ID</th>
              <th scope="col">Tier</th>
              <th scope="col">Created Date</th>
            </tr>
          </thead>
          <tbody>{this.renderCompanyData()}</tbody>
        </table>
      </div>
    );
  }
}

export default App;
