import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faCheckSquare,
  faMinusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { getImgSm } from "../utils/pokeApi";

class BreederSummary extends Component {
  state = { url: "" };

  setIcon = async () => {
    const url = await getImgSm(this.props.breeder.name.toLowerCase());
    this.setState({ url });
  };

  async componentDidMount() {
    this.setIcon();
  }

  async componentDidUpdate() {
    this.setIcon();
  }

  render() {
    // const stats = ["hp", "atk", "def", "spa", "spd", "spe", "nature"];
    const { breeder, index, deletePoke, target } = this.props;
    const { url } = this.state;
    const stats = Object.keys(target.active);
    const activeStats = stats.filter((stat) => target.active[stat] === true);

    return (
      <div key={index} className="card col-3 d-inline-block p-3">
        <p>{breeder.name}</p>
        <img src={url} alt="not found" />
        <div className="row">
          {activeStats.map((stat, index) => (
            <div
              className="col-4 d.inline-block"
              style={{ padding: "1px" }}
              key={index}
            >
              <FontAwesomeIcon
                icon={breeder[stat] ? faCheckSquare : faMinusSquare}
                style={{
                  color: `${breeder[stat] ? "limegreen" : "tomato"}`,
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
