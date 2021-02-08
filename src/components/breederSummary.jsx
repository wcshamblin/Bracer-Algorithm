import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import { getImgSm, cancelTokenSource } from "../utils/pokeApi";
import { capitalize } from "../utils/capitalize";
import { genderIcons } from "../utils/remap";

class BreederSummary extends Component {
  state = { url: "" };

  setIcon = async () => {
    const url = await getImgSm(this.props.breeder.name.toLowerCase());
    if (url !== this.state.url) {
      this.setState({ url });
    }
  };

  async componentDidMount() {
    this.setIcon();
  }

  async componentDidUpdate() {
    this.setIcon();
  }

  componentWillUnmount() {
    cancelTokenSource.cancel();
  }

  render() {
    const { breeder, index, deletePoke, target } = this.props;
    const { url } = this.state;
    const stats = Object.keys(target.active);
    const activeStats = stats.filter((stat) => target.active[stat] === true);

    return (
      <div
        key={index}
        className="card col-3 d-inline-block p-3 text-center user-select-none"
      >
        <FontAwesomeIcon
          className="mr-1"
          icon={genderIcons[breeder.gender].icon}
          style={{ color: `${genderIcons[breeder.gender].color}` }}
        ></FontAwesomeIcon>
        {capitalize(breeder.name)}
        <div className="iconParent">
          {url && <img src={url} alt={breeder.name} />}
        </div>
        <div className="row mt-1">
          {activeStats.map((stat, index) => (
            <div
              className="col-md-4 col-6 d.inline-block text-nowrap"
              style={{ padding: "1px" }}
              key={index}
            >
              <FontAwesomeIcon
                icon={breeder.ivs[stat] || breeder[stat] ? faCheck : faBan}
                style={{
                  color: `${
                    breeder.ivs[stat] || breeder[stat]
                      ? "rgb(58,167,77)"
                      : "rgb(216,45,69)"
                  }`,
                }}
              ></FontAwesomeIcon>
              <p>
                {stat !== "nature" &&
                  `${target.data[stat]} ${stat.toUpperCase()}`}
                {stat === "nature" && `${target.data[stat]}`}
              </p>
            </div>
          ))}
        </div>
        <button onClick={() => deletePoke(index)} className="btn btn-danger">
          <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
        </button>
      </div>
    );
  }
}

export default BreederSummary;
