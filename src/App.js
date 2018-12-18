import React, { Component } from "react";
import { auth, db } from "./Auth";
import Modal from "react-modal";
import moment from "moment";
import { CSVLink } from "react-csv";
import "./App.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

class App extends Component {
  state = {
    businessName: "",
    bID: "",
    tier: "",
    dateCreated: "",
    companyData: "",
    modalOpen: false,
    activeItem: null
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
        .then(() => this.setState({ companyData, baseData: companyData }));
    });
  };

  renderCompanyData = () => {
    let { companyData } = this.state;
    return companyData[0].map((item, index) => {
      return (
        <tr
          key={item[0]}
          className="info-row"
          onClick={() => this.displayInfo(item)}
        >
          <td className="col-sm-1">
            <strong>{index + 1}</strong>
          </td>
          <td className="col-sm-4">{item[1].name}</td>
          <td className="col-sm-4">{item[0]}</td>
          <td className="col-sm-1">{item[1].tier}</td>
          <td className="col-sm-2">Dec 17, 2018</td>
        </tr>
      );
    });
  };
  displayInfo = item => {
    this.setState({ activeItem: item }, () => this.openModal());
  };
  openModal = () => {
    this.setState({ modalOpen: true });
  };
  closeModal = () => {
    this.setState({ modalOpen: false });
  };
  onChange = e => {
    e.preventDefault();
    let { companyData, baseData } = this.state;
    let search = e.target.value;
    let arr = [];
    if (!search) {
      this.setState({ companyData: baseData });
    } else {
      baseData[0].map(item => {
        if (item[1].name.toUpperCase().includes(search.toUpperCase())) {
          arr.push(item);
        }
      });
      this.setState({ companyData: [arr] });
    }
  };

  render() {
    let { companyData } = this.state;
    let { activeItem } = this.state;
    if (!this.state.companyData) {
      return <h1>Loading...</h1>;
    }
    let data = [];
    companyData[0].map(item => {
      let obj = {
        name: item[1].name,
        bID: item[0],
        address: item[1].address.street,
        city: item[1].address.city,
        employees: Object.keys(item[1].employees).length,
        locationID: item[1].locationID,
        placeID: item[1].placeID,
        website: item[1].website
      };
      data.push(obj);
    });
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
            <div className=" form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Company Name"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <CSVLink className="form-control btn-success" data={data}>
                Download CSV
              </CSVLink>
            </div>
          </form>
        </nav>
        <table className="table table-bordered table-dark">
          <thead>
            <tr>
              <th scope="col">Index</th>
              <th scope="col">Company Name</th>
              <th scope="col">Company ID</th>
              <th scope="col">Tier</th>
              <th scope="col">Created Date</th>
            </tr>
          </thead>
          <tbody>{this.renderCompanyData()}</tbody>
        </table>
        <Modal
          isOpen={this.state.modalOpen}
          onRequestClose={this.closeModal}
          ariaHideApp={false}
          style={customStyles}
        >
          <h2>Client Information</h2>
          <ul>
            <li>
              <strong>Company name: </strong>
              {activeItem ? activeItem[1].name : null}
            </li>
            <li>
              <strong>Company ID: </strong>
              {activeItem ? activeItem[0] : null}
            </li>
            <li>
              <strong>Location ID: </strong>
              {activeItem ? activeItem[1].locationID : null}
            </li>
            <li>
              <strong>Employee count: </strong>
              {activeItem ? Object.keys(activeItem[1].employees).length : null}
            </li>
            <li>
              <strong>Client Tier: </strong>
              {activeItem ? activeItem[1].tier : null}
            </li>
            <li>
              <strong>Company Address: </strong>
              {activeItem
                ? `${activeItem[1].address.street}, ${
                    activeItem[1].address.state
                  }`
                : null}
            </li>
            <li>
              <strong>Company Phone: </strong>
              {activeItem ? activeItem[1].address.phonenumber : null}
            </li>
            <li>
              <strong>Company Website: </strong>
              {activeItem ? (
                <a href={activeItem[1].website} target="_blank">
                  {activeItem[1].website}
                </a>
              ) : null}
            </li>
          </ul>
          <button className="btn-lg btn-danger" onClick={this.closeModal}>
            close
          </button>
        </Modal>
      </div>
    );
  }
}

export default App;
