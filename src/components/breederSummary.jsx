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
    const stats = ["hp", "atk", "def", "spa", "spd", "spe", "nature"];
    const { breeder, index, deletePoke } = this.props;
    const { url } = this.state;

    return (
      <div key={index} className="card col-3 d-inline-block p-3">
        <p>{breeder.name}</p>
        <img src={url} alt="not found" />
        <div className="row">
          {stats.map((stat, index) => (
            <div
              className="col-4 d.inline-block"
              style={{ padding: "1px" }}
              key={index}
            >
              <React.Fragment>
                <FontAwesomeIcon
                  icon={breeder[stat] ? faCheckSquare : faMinusSquare}
                  style={{
                    color: `${breeder[stat] ? "limegreen" : "tomato"}`,
                  }}
                ></FontAwesomeIcon>
                <p>
                  {stat !== "nature" && `31 ${stat.toUpperCase()}`}
                  {stat === "nature" && "Nature"}
                </p>
              </React.Fragment>
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
