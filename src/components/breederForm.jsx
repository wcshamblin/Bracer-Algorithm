import React from "react";
import Form from "./common/form/form";
import Joi from "joi-browser";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { getImg } from "../utils/pokeApi";
import { capitalize } from "../utils/capitalize";
import questionmark from "../question-mark.png";

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
    url: questionmark,
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
    this.props.addPokemon(this.state.data);
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
    const { url } = this.state;
    const { allPokes } = this.props;
    const stats = ["hp", "atk", "def", "spa", "spd", "spe", "nature"];
    return (
      <React.Fragment>
        <h4 className="text-center mt-2 user-select-none">Add your pokemon:</h4>
        <div className="col-4 offset-4 card text-center user-select-none">
          <form id="reset" onSubmit={this.handleSubmit}>
            {/* INPUT BOX */}
            <Typeahead
              id="typeahead"
              placeholder="Add a pokemon..."
              minLength={2}
              highlightOnlyResult
              onChange={(selected) => this.handleInputChange(selected)}
              options={allPokes}
            ></Typeahead>
            <div className="col-6 d-inline-block">
              <img
                src={url}
                alt="hello"
                style={{ border: "1px solid black" }}
              />
            </div>
            <div className="col-6 d-inline-block">
              {/* 31 IV CHECKBOXES */}
              {stats.map((stat) => (
                <div key={stat}>
                  {stat !== "nature" &&
                    this.renderCheckbox(stat, `31 ${stat.toUpperCase()}`)}
                  {stat === "nature" &&
                    this.renderCheckbox(stat, capitalize(stat))}
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
