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
    tree: {},
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

  getTree = async () => {
    console.log("getting tree...");
    const url = "http://127.0.0.1:5000/boxbreed/";
    const data = convertToJSON(this.state);
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    const response = await http.post(url, data, config);
    console.log(response);
    this.setState({ tree: response.data });
  };

  render() {
    const { page, pageMin, pageMax, allPokes, tree } = this.state;
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
          {page === 3 && (
            <Tree target={target} getTree={this.getTree} tree={tree}></Tree>
          )}
        </main>
        <StickyFooter
          changePage={this.changePage}
          page={page}
          pageMin={pageMin}
          pageMax={pageMax}
          target={target}
        ></StickyFooter>
        <div className="my-3">
          <br />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
