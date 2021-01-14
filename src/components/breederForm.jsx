import React from "react";
import Form from "./common/form/form";
import Joi from "joi-browser";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { findEggGroup, getImg } from "../utils/pokeApi";
import { mapBreederSchema } from "../utils/remap";
import PokeSearch from "./pokeSearch";

class BreederForm extends Form {
  state = {
    data: {
      name: "",
      hp: false,
      atk: false,
      def: false,
      spa: false,
      spd: false,
      spe: false,
      nature: false,
      eggGroups: [],
    },
    url: null,
    errors: {},
  };

  schema = {
    name: Joi.string().required(),
    hp: Joi.boolean().required(),
    atk: Joi.boolean().required(),
    def: Joi.boolean().required(),
    spa: Joi.boolean().required(),
    spd: Joi.boolean().required(),
    spe: Joi.boolean().required(),
    nature: Joi.boolean().required(),
    eggGroups: Joi.array().items(Joi.string()).required(),
  };

  doSubmit = () => {
    const { data } = this.state;
    const breederSchema = mapBreederSchema(data);
    this.props.addPokemon(breederSchema);
    this.clearForm();
    document.getElementById("reset").reset();
  };

  handleInputChange = async (selected) => {
    if (selected.length === 0) return;
    let name = selected[0];
    name = name.toLowerCase();
    const eggGroups = await findEggGroup(name);
    const url = await getImg(name);
    this.setState({
      data: { ...this.state.data, name, eggGroups },
      url,
    });
  };

  clearForm = () => {
    this.setState({
      data: {
        ...this.state.data,
        hp: false,
        atk: false,
        def: false,
        spa: false,
        spd: false,
        spe: false,
        nature: false,
      },
      errors: {},
    });
  };

  render() {
    const { data, url } = this.state;
    const { allPokes, target } = this.props;
    const stats = Object.keys(target.active);
    const activeStats = stats.filter((stat) => target.active[stat] === true);

    return (
      <React.Fragment>
        <h5 className="text-center user-select-none my-5">Step 2:</h5>
        <h6 className="text-center user-select-none">
          Please fill out the details of each breeder you own, and add them to
          your box:
        </h6>
        <div className="col-md-4 offset-md-4 card text-center user-select-none">
          <form id="reset" className="p-3" onSubmit={this.handleSubmit}>
            <PokeSearch
              allPokes={allPokes}
              data={data}
              url={url}
              handleInputChange={this.handleInputChange}
            ></PokeSearch>
            <div className="row">
              {activeStats.map((stat) => (
                <div key={stat} className="col-md-4 col-6">
                  {stat !== "nature" &&
                    this.renderCheckbox(
                      stat,
                      `${target.data[stat]} ${stat.toUpperCase()}`
                    )}
                  {stat === "nature" &&
                    this.renderCheckbox(stat, `${target.data[stat]}`)}
                </div>
              ))}
            </div>
            {this.renderButton("Enter")}
            <p className="mt-3">
              Only the stats relevant to the target will be rendered as
              checkboxes. <br></br>
              All other stats can be omitted.
            </p>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default BreederForm;
