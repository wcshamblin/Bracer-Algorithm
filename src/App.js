import React, { Component } from "react";
import MainForm from "./components/mainForm";
import TargetForm from "./components/targetForm";
import StickyFooter from "./components/stickyFooter";
import { getAllPokes } from "./utils/pokeApi";
import { capitalize } from "./utils/capitalize";

class App extends Component {
  state = {
    page: 1,
    pageMin: 1,
    pageMax: 3,
    allPokes: [],
    target: {},
    breeders: [],
  };

  changePage = (value) => {
    let { page, pageMin, pageMax } = this.state;
    page = page + value;
    if (page < pageMin) return;
    if (page > pageMax) return;
    this.setState({ page });
  };

  async componentDidMount() {
    const { data } = await getAllPokes();
    const allPokes = data.results.map((poke) => capitalize(poke.name));
    this.setState({ allPokes });
  }

  render() {
    const { page, allPokes } = this.state;
    return (
      <React.Fragment>
        <main className="container-fluid">
          {page === 1 && <TargetForm allPokes={allPokes}></TargetForm>}
          {page === 2 && <p>are you doing gtl breed y/n</p>}
          {page === 3 && <MainForm allPokes={allPokes}></MainForm>}
        </main>
        <StickyFooter changePage={this.changePage}></StickyFooter>
      </React.Fragment>
    );
  }
}

export default App;
