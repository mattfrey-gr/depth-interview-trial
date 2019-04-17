import React, { Component, Fragment } from 'react';
import './App.css';
import { allData } from './data.js';

const DoctorRow = ({doctor}) => (
  <div className="search-result">
    <div>{`${doctor.first_name} ${doctor.last_name}`}</div>
    <div>{doctor.specialty.join(' | ')}</div>
    <div>{doctor.Address}</div>
    <ul>
      {doctor.insuranceList.map(i => <li key={i.id}>{i.name}</li>)}
    </ul>
  </div>
);

const SearchResults = ({searchResults}) => (
  <div className="search-results">
    {searchResults.length > 0 ? (
      <Fragment>
        {searchResults.map(d => <DoctorRow key={d.doctor_id} doctor={d} />)}
      </Fragment>
    ) : (
      <Fragment>No Results</Fragment>
    )}
  </div> 
);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasSearched: false,
    };
  }

  setSearchTerm = ev => {
    this.setState({ searchTerm: ev.target.value });
  };

  searchDoctors = () => {
    const { searchTerm } = this.state;

    const matchingDoctorIds = Object.keys(this.state.data.doctors).filter(id => {
      const d = this.state.data.doctors[id];
      const fullName = `${d.first_name} ${d.last_name}`;
      return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const matchingInsurance = Object.values(this.state.data.insurance).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    matchingInsurance.forEach(i => i.doctors.forEach(d => matchingDoctorIds.push(d.doctor_id)));

    const matchingDoctors = [];
    const uniqueIds = new Set(matchingDoctorIds);
    uniqueIds.forEach(id => matchingDoctors.push(this.state.data.doctors[id]));
    console.log(matchingDoctors);

    this.setState({
      hasSearched: true,
      searchResults: matchingDoctors,
    });
  };

  async componentDidMount() {
    const data = await allData();
    this.setState({ data });
  }

  render() {
    if (!this.state.data) {
      return <div className="App">Loading...</div>;
    }

    return (
      <div className="App">
        <div className="search-container">
          <input
            className="search-box"
            type="text"
            onChange={ev => this.setSearchTerm(ev)}
          />
          <button
            onClick={() => this.searchDoctors()}
          >
            Search
          </button>
        </div>
        <div className="search-results">
          {this.state.hasSearched && <SearchResults searchResults={this.state.searchResults} />}
        </div>
      </div>
    );
  }
}

export default App;
