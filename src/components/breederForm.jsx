import React from "react";
import Form from "./common/form/form";
import Joi from "joi-browser";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { getImg } from "../utils/pokeApi";

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
  };

  doSubmit = () => {
    const { name, hp, atk, def, spa, spd, spe, nature } = this.state.data;
    const breederSchema = {
      name,
      ivs: {
        hp,
        atk,
        def,
        spa,
        spd,
        spe,
      },
      nature,
    };
    this.props.addPokemon(breederSchema);
    this.clearForm();
    document.getElementById("reset").reset();
  };

  handleInputChange = async (selected) => {
    if (selected.length === 0) return;
    const name = selected[0];
    const url = await getImg(name.toLowerCase());
    this.setState({ data: { ...this.state.data, name }, url });
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
    const { url, data } = this.state;
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
            <Typeahead
              id="typeahead"
              placeholder="Search Pokemon by name..."
              minLength={2}
              highlightOnlyResult
              onChange={(selected) => this.handleInputChange(selected)}
              options={allPokes}
            ></Typeahead>
            <div className="col-md-4 offset-md-4 my-3">
              <div className="imageParent">
                <img src={url} alt={data.name} />
              </div>
            </div>
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
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default BreederForm;
