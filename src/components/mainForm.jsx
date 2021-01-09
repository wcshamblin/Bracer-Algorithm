import React, { Component } from "react";
import BreederForm from "./breederForm";
import BreederBoxes from "./breederBoxes";

class MainForm extends Component {
  state = {
    breeders: [],
    errors: {},
  };

  componentDidMount() {
    const { breeders } = this.props;
    console.log(breeders);
    this.setState({ breeders });
  }

  addPokemon = (newPoke) => {
    this.setState(
      ({ breeders }) => ({
        breeders: [...breeders, newPoke],
      }),
      this.doSubmit
    );
  };

  doSubmit = () => {
    this.props.dataSubmit(this.state.breeders, "breeders");
  };

  deletePoke = (index) => {
    let pokes = this.state.breeders;
    if (index > -1) {
      pokes.splice(index, 1);
    }
    this.setState({ breeders: pokes });
  };

  render() {
    const { breeders } = this.state;
    const { allPokes, target } = this.props;

    return (
      <React.Fragment>
        <BreederForm
          addPokemon={this.addPokemon}
          allPokes={allPokes}
          target={target}
        ></BreederForm>
        <BreederBoxes
          breeders={breeders}
          deletePoke={this.deletePoke}
          target={target}
        ></BreederBoxes>
        <div className="my-5"></div>
      </React.Fragment>
    );
  }
}

export default MainForm;
