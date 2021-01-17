import React from "react";
import Form from "./common/form/form";
import Joi from "joi-browser";
import {
  getNatures,
  findEggGroup,
  getAllBraceIcons,
  getImg,
} from "../utils/pokeApi";
import { capitalize } from "../utils/capitalize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import PokeSearch from "./pokeSearch";
import _ from "lodash";

class TargetForm extends Form {
  state = {
    data: {
      name: "",
      hp: 31,
      atk: 31,
      def: 31,
      spa: 31,
      spd: 31,
      spe: 31,
      nature: "Adamant",
      eggGroups: [],
    },
    active: {
      hp: true,
      atk: true,
      def: true,
      spa: true,
      spd: true,
      spe: true,
      nature: true,
    },
    allNatures: [],
    url: null,
    braces: {},
    errors: {},
  };

  schema = {
    name: Joi.string().required().min(1),
    nature: Joi.string(),
    hp: Joi.number().integer().min(0).max(31),
    atk: Joi.number().integer().min(0).max(31),
    def: Joi.number().integer().min(0).max(31),
    spa: Joi.number().integer().min(0).max(31),
    spd: Joi.number().integer().min(0).max(31),
    spe: Joi.number().integer().min(0).max(31),
  };

  async componentDidMount() {
    //populate natures dropdown
    const { data } = await getNatures();
    const allNatures = data.results
      .map((nature) => capitalize(nature.name))
      .sort();
    this.setState({ allNatures });

    //persist target when component reloads
    const { target } = this.props;
    if (!_.isEmpty(target)) {
      const url = await getImg(target.data.name);
      this.setState({ data: target.data, active: target.active, url });
    }

    //get item icons
    const braces = await getAllBraceIcons();
    this.setState({ braces });
  }

  doSubmit = () => {
    const data = {
      target: {
        data: { ...this.state.data },
        active: { ...this.state.active },
      },
      breeders: [],
    };
    this.props.dataSubmit(data, "data");
  };

  handleInputChange = async (selected) => {
    this.setState({ saved: false });
    if (selected.length === 0) return;
    const name = selected[0].toLowerCase();
    const eggGroups = await findEggGroup(name);
    const url = await getImg(name);
    this.setState(
      { data: { ...this.state.data, name, eggGroups }, url },
      this.doSubmit
    );
  };

  disableStat = (input) => {
    this.setState({ saved: false });
    let stat = this.state.active[input];
    stat = !stat;

    this.setState(
      { active: { ...this.state.active, [input]: stat } },
      this.doSubmit
    );
  };

  render() {
    const { allNatures, active, data, braces, url } = this.state;
    const stats = Object.keys(active);
    const { allPokes } = this.props;

    return (
      <React.Fragment>
        <h5 className="text-center user-select-none my-5">Step 1:</h5>
        <h6 className="text-center user-select-none">
          Please fill out the details of the target Pokemon you would like to
          breed:
        </h6>
        <div className="col-lg-4 offset-lg-4 card text-center user-select-none">
          <form id="reset" className="p-3" onSubmit={this.handleSubmit}>
            <PokeSearch
              allPokes={allPokes}
              data={data}
              url={url}
              handleInputChange={this.handleInputChange}
            ></PokeSearch>
            <div className="row">
              {stats.map((stat) => (
                <div key={stat} className="col-6 d-inline-block">
                  <div className="col-2 d-inline-block">
                    {braces[stat] && <img src={braces[stat]} alt="brace" />}
                  </div>
                  <div className="col-8 d-inline-block">
                    {stat !== "nature" &&
                      this.renderNumInput(
                        stat,
                        stat.toUpperCase(),
                        !active[stat]
                      )}
                    {stat === "nature" &&
                      this.renderSelect(
                        "nature",
                        "Nature",
                        allNatures,
                        !active[stat]
                      )}
                  </div>
                  <div className="col-2 d-inline-block">
                    <button
                      onClick={() => this.disableStat(stat)}
                      className={`btn btn-${
                        active[stat] ? "success" : "danger"
                      }`}
                      type="button"
                    >
                      <FontAwesomeIcon
                        icon={active[stat] ? faCheck : faBan}
                      ></FontAwesomeIcon>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3">
              Any stats that aren't relevant on the final breed may be toggled
              off.
            </p>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default TargetForm;
