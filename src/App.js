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

  comparator = (stat) => {
    const { active, data } = this.state.data.target;
    if (active[stat]) {
      return data[stat];
    }
    return "False";
  };

  jsonFactory = () => {
    const { target, breeders } = this.state.data;
    const stats = Object.keys(target.active);
    const schema = {
      target: { name: target.data.name, ivs: {} },
      breeders: breeders,
    };
    stats.map((stat) => (schema.target.ivs[stat] = this.comparator(stat)));
    const result = JSON.stringify(schema);
    console.log(result);
    return result;
  };

  render() {
    const { page, pageMin, pageMax, allPokes } = this.state;
    const { target, breeders } = this.state.data;
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
          {page === 2 && (
            <MainForm
              allPokes={allPokes}
              dataSubmit={this.dataSubmit}
              target={target}
              breeders={breeders}
            ></MainForm>
          )}
          {page === 3 && (
            <button onClick={this.jsonFactory}>calculate!!</button>
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
