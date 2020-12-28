import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { getImgSm } from "../utils/pokeApi";

class BreederSummary extends Component {
  state = { url: "" };

  async componentDidMount() {
    const url = await getImgSm(this.props.breeder.name.toLowerCase());
    this.setState({ url });
  }

  render() {
    const stats = ["hp", "atk", "def", "spa", "spdef", "spe"];
    const { breeder, index, deletePoke } = this.props;
    const { url } = this.state;

    return (
      <div key={index} className="card col-3 d-inline-block">
        <p>{breeder.name}</p>
        <img src={url} alt="not found" />
        {stats.map((stat, index) => (
          <div key={index}>
            {breeder[stat] === true ? <p>31 {stat}</p> : null}
          </div>
        ))}
        <button onClick={() => deletePoke(index)} className="btn btn-danger">
          <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
        </button>
      </div>
    );
  }
}

export default BreederSummary;
