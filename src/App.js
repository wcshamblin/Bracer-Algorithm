import React, { Component } from "react";
import MainForm from "./components/mainForm";
import TargetForm from "./components/targetForm";
import StickyFooter from "./components/stickyFooter";
import Tree from "./components/tree";
import { getAllPokes } from "./utils/pokeApi";
import { capitalize } from "./utils/capitalize";
import { convertToJSON } from "./utils/remap";
import http from "./services/httpService";

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
    if (type === "data") {
      this.setState({ data: object });
    } else {
      this.setState({ data: { ...this.state.data, [type]: object } });
    }
  };

  async componentDidMount() {
    const { data } = await getAllPokes();
    const allPokes = data.results.map((poke) => capitalize(poke.name));
    this.setState({ allPokes });
  }

  getTree = async (cancelTokenSource) => {
    const url = `${process.env.REACT_APP_API_URL}/api/boxbreed/`;
    const payload = convertToJSON(this.state);
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      cancelToken: cancelTokenSource.token,
    };
    const tree = await http.post(url, payload, config);
    console.log("response:", tree);
    return tree;
  };

  render() {
    const { page, pageMin, pageMax, allPokes } = this.state;
    const { target, breeders } = this.state.data;
    return (
      <React.Fragment>
        <main className="container-fluid mb-5">
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
          {page === 3 && <Tree target={target} getTree={this.getTree}></Tree>}
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
