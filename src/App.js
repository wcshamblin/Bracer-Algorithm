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
    data: {
      target: {},
      breeders: [],
    },
  };

  changePage = (value) => {
    let { page, pageMin, pageMax } = this.state;
    page = page + value;
    if (page < pageMin) return;
    if (page > pageMax) return;
    this.setState({ page });
  };

  dataSubmit = (object, type) => {
    this.setState({ data: { ...this.state.data, [type]: object } });
  };

  async componentDidMount() {
    const { data } = await getAllPokes();
    const allPokes = data.results.map((poke) => capitalize(poke.name));
    this.setState({ allPokes });
  }

  render() {
    const { page, pageMin, pageMax, allPokes } = this.state;
    const { target } = this.state.data;
    return (
      <React.Fragment>
        <main className="container-fluid">
          {page === 1 && (
            <TargetForm
              target={target}
              allPokes={allPokes}
              dataSubmit={this.dataSubmit}
            ></TargetForm>
          )}
          {page === 2 && <p>are you doing gtl breed y/n</p>}
          {page === 3 && (
            <MainForm
              allPokes={allPokes}
              dataSubmit={this.dataSubmit}
              target={target}
            ></MainForm>
          )}
        </main>
        <StickyFooter
          changePage={this.changePage}
          page={page}
          pageMin={pageMin}
          pageMax={pageMax}
          target={target}
        ></StickyFooter>
      </React.Fragment>
    );
  }
}

export default App;
