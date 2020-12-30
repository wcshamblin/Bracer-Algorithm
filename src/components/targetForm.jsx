import React from "react";
import Form from "./common/form/form";
import Joi from "joi-browser";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import questionmark from "../question-mark.png";
import { getImg, getNatures } from "../utils/pokeApi";
import { capitalize } from "../utils/capitalize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

class BreederForm extends Form {
  state = {
    data: {
      name: "",
      hp: 31,
      atk: 31,
      def: 31,
      spa: 31,
      spd: 31,
      spe: 31,
      nature: "",
    },
    url: questionmark,
    allNatures: [],
    errors: {},
  };

  schema = {
    name: Joi.string().required(),
    nature: Joi.string().required(),
    hp: Joi.number().integer().min(0).max(31),
    atk: Joi.number().integer().min(0).max(31),
    def: Joi.number().integer().min(0).max(31),
    spa: Joi.number().integer().min(0).max(31),
    spd: Joi.number().integer().min(0).max(31),
    spe: Joi.number().integer().min(0).max(31),
  };

  async componentDidMount() {
    const { data } = await getNatures();
    const allNatures = data.results
      .map((nature) => capitalize(nature.name))
      .sort();

    this.setState({ allNatures });
  }

  doSubmit = () => {
    // this.props.addPokemon(this.state.data);
    // document.getElementById("reset").reset();
    console.log(this.state.data);
  };

  handleInputChange = async (selected) => {
    if (selected.length === 0) return;
    const name = selected[0];
    const url = await getImg(name.toLowerCase());
    this.setState({ data: { ...this.state.data, name }, url });
  };

  deleteItem = (input) => {
    console.log(`deleted ${input} !`);
  };

  render() {
    const { url, allNatures } = this.state;
    const { allPokes } = this.props;
    const stats = ["hp", "atk", "def", "spa", "spd", "spe"];
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
              {/* IV INPUTS */}
              {stats.map((stat) => (
                <div key={stat}>
                  <div className="col-8 d-inline-block">
                    {this.renderNumInput(stat, stat)}
                  </div>
                  <div className="col-4 d-inline-block">
                    <button
                      type="button"
                      onClick={() => this.deleteItem(stat)}
                      className="btn btn-danger"
                    >
                      <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                    </button>
                  </div>
                </div>
              ))}
              <div>
                <div className="col-8 d-inline-block">
                  {this.renderSelect("nature", "Nature", allNatures)}
                </div>
                <div className="col-4 d-inline-block">
                  <button
                    type="button"
                    onClick={() => this.deleteItem("nature")}
                    className="btn btn-danger"
                  >
                    <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                  </button>
                </div>
              </div>
            </div>
            {this.renderButton("Enter")}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default BreederForm;
