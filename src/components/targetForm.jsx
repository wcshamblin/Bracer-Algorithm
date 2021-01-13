import React from "react";
import Form from "./common/form/form";
import Joi from "joi-browser";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import {
  getImg,
  getNatures,
  getItemIcon,
  findEggGroup,
} from "../utils/pokeApi";
import { capitalize } from "../utils/capitalize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
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
    eggGroups: [],
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
    //populate natures input
    const { data } = await getNatures();
    const allNatures = data.results
      .map((nature) => capitalize(nature.name))
      .sort();

    this.setState({ allNatures });

    //populate form with existing target
    const { target } = this.props;
    if (!_.isEmpty(target)) {
      let url = (await getImg(target.data.name.toLowerCase())) || null;
      this.setState({ data: target.data, active: target.active, url });
    }

    //get item icons
    const braces = ["weight", "bracer", "belt", "lens", "band", "anklet"];
    const stats = Object.keys(this.state.active);
    let urls = await Promise.all(
      braces.map(async (brace) => await getItemIcon(`power-${brace}`))
    );
    urls.push(await getItemIcon("everstone"));
    let braceObject = {};
    stats.map((stat, index) => (braceObject[stat] = urls[index]));
    this.setState({ braces: braceObject });
  }

  componentDidUpdate() {
    // console.log(this.state);
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
    const url = await getImg(name);
    const eggGroups = await findEggGroup(name);

    this.setState(
      { data: { ...this.state.data, name }, url, eggGroups },
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
    const { url, eggGroups, allNatures, active, data, braces } = this.state;
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
            <Typeahead
              id="typeahead"
              placeholder="Search Pokemon by name..."
              minLength={2}
              highlightOnlyResult
              onChange={(selected) => this.handleInputChange(selected)}
              options={allPokes}
            ></Typeahead>
            <div className="row">
              <div className="col-4 offset-4 my-3">
                <div className="imageParent">
                  <img src={url} alt={data.name} />
                </div>
              </div>
              <div className="col-4">
                Egg Group:
                {eggGroups.map((group, index) => (
                  <p key={index}>{capitalize(group)}</p>
                ))}
              </div>
            </div>
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
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default TargetForm;
