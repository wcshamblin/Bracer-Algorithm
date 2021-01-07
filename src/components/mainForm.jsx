import React from "react";
import Form from "./common/form/form";
import BreederForm from "./breederForm";
import BreederBoxes from "./breederBoxes";
import Joi from "joi-browser";

class MainForm extends Form {
  state = {
    breeders: [],
    errors: {},
  };

  schema = {
    breeders: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        hp: Joi.boolean().required(),
        atk: Joi.boolean().required(),
        def: Joi.boolean().required(),
        spa: Joi.boolean().required(),
        spd: Joi.boolean().required(),
        spe: Joi.boolean().required(),
      })
    ),
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
        <form
          onSubmit={this.handleSubmit}
          className="text-center mt-2 mb-5"
        ></form>
      </React.Fragment>
    );
  }
}

export default MainForm;
