import React, { Component } from 'react';
import axios from 'axios';
require('dotenv').config();

const api = 'https://arcana.nu/api/v1/jb/8/player_bests/?profile_id=';
const query = 'BZ9wUOWTP51';
const url = api + query;
const options = {
  "method": "GET",
  "headers": {
    "authorization": "Bearer " + process.env.REACT_APP_ARCANA_BEARER_TOKEN
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      error: null,
      items: [],
      profile: [],
      music: [],
      charts: [],
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    axios.get(url, options)
    .then(result => this.setState({ 
      items: result.data._items,
      profile: result.data._related.profiles[0], 
      music: result.data._related.music,
      charts: result.data._related.charts,
      isLoading: false 
    }))
    .catch(error => this.setState({ 
      error, 
      isLoading: false 
    }));
  }

  render() {
    const {items, profile, music, charts, isLoading, error} = this.state;

    if (error) {
      return <p>{error.message}</p>;
    }

    if (isLoading) {
      return <p>Loading ...</p>;
    }

    if (!items) {
      return <p>No data yet...</p>
    }

    if (!music) {
      return <p>No music yet...</p>
    }

    let db = [];
    music.forEach(song => {
      db[song._id] = song.title;
    });
    console.log(db['FtpnbkNpCls']);
    
    return (
      <div>
      <style>{"table {border-collapse: collapse;} td, th {border: 2px solid black; padding: 0.5rem} th {background-color: black; color: white;} tbody tr {background-color: #fff} tbody tr:nth-child(even) {background-color: #eee;} div {margin: 0 auto; max-width:35rem; padding: 1rem} h1 {text-align: center} body {background: #ddd;}"}</style>
      <h1>【{profile.name}】 JUBEAT PROFILE</h1>
        <table>
        <thead>
          <tr>
            <th>Song Name</th>
            <th>Chart</th>
            <th>Difficulty</th>
            <th>Score</th>
            <th>Clear Type</th>
          </tr>
        </thead>
        <tbody>
        {items.map((item, i) => 
          <tr key={item._id}>
            <td>{db[item.music_id]}</td>
            <td>{charts[i].chart_type}</td>
            <td>{charts[i].rating}</td>
            <td>{item.score}</td>
            <td>{item.clear_type}</td>
          </tr>
        )}
        </tbody>
        </table>
      </div>
    )
  }
}

export default App;