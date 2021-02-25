import React from "react";
import Form from "./common/form/form";
import Joi from "joi-browser";
import "react-bootstrap-typeahead/css/Typeahead.css";
import {
  findEggGroup,
  getGenders,
  getImg,
  getPokemonSpecies,
} from "../utils/pokeApi";
import { mapBreederSchema, genderIcons } from "../utils/remap";
import PokeSearch from "./pokeSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CheckButton from "./checkButton";

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
      gender: "",
    },
    genders: [],
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
    eggGroups: Joi.array()
      .items(Joi.string().invalid("Cannot breed"))
      .required(),
    gender: Joi.string().required(),
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
    const species = await getPokemonSpecies(name);
    const genders = await getGenders(species);
    const eggGroups = await findEggGroup(species);
    const url = await getImg(name);
    this.setState({
      data: {
        ...this.state.data,
        name,
        eggGroups,
        gender: `${genders.length === 1 ? genders[0] : ""}`,
      },
      url,
      genders,
    });
  };

  genderSelect = (gender) => {
    this.setState({ data: { ...this.state.data, gender } });
  };

  disableStat = (stat) => {
    const { data } = this.state;
    data[stat] = !data[stat];
    this.setState({ data });
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
    const { data, url, genders } = this.state;
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
            <div className="row d-flex justify-content-center">
              {genders.map((gender) => (
                <button
                  key={gender}
                  type="button"
                  className={`m-1 btn btn-light ${
                    gender === data.gender && "active"
                  }`}
                  onClick={() => this.genderSelect(gender)}
                >
                  <FontAwesomeIcon
                    icon={genderIcons[gender].icon}
                    style={{ color: `${genderIcons[gender].color}` }}
                  ></FontAwesomeIcon>
                </button>
              ))}
            </div>
            <div className="row">
              {activeStats.map((stat) => (
                <div key={stat} className="col-md-4 col-6">
                  {
                    <React.Fragment>
                      <CheckButton
                        stat={stat}
                        active={data}
                        disableStat={this.disableStat}
                      ></CheckButton>
                      <p>
                        {stat === "nature"
                          ? target.data.nature
                          : stat.toUpperCase()}
                      </p>
                    </React.Fragment>
                  }
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
