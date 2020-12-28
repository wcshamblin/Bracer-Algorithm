import React from "react";
import Form from "./common/form/form";
import Joi from "joi-browser";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { getAllPokes, getImg, getImgSm } from "../utils/pokeApi";
import { capitalize } from "../utils/capitalize";
import questionmark from "../question-mark.png";

class BreederForm extends Form {
  state = {
    allPokes: [],
    data: {
      name: "",
      hp: false,
      atk: false,
      def: false,
      spa: false,
      spdef: false,
      spe: false,
    },
    url: questionmark,
    errors: {},
  };

  schema = {
    name: Joi.string().required().label("Name"),
    hp: Joi.boolean().required().label("31 HP"),
    atk: Joi.boolean().required().label("31 atk"),
    def: Joi.boolean().required().label("31 def"),
    spa: Joi.boolean().required().label("31 spa"),
    spdef: Joi.boolean().required().label("31 spdef"),
    spe: Joi.boolean().required().label("31 spe"),
  };

  async componentDidMount() {
    const { data } = await getAllPokes();
    const allPokes = data.results.map((poke) => capitalize(poke.name));
    this.setState({ allPokes });
  }

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
        spdef: false,
        spe: false,
      },
      errors: {},
    });
  };

  render() {
    const { allPokes, url } = this.state;
    const stats = ["hp", "atk", "def", "spa", "spdef", "spe"];
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
                <div key={stat}>{this.renderCheckbox(stat, `31 ${stat}`)}</div>
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
