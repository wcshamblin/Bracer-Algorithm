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

  async componentDidMount() {
    const url = await getImgSm(this.props.breeder.name.toLowerCase());
    this.setState({ url });
  }

  render() {
    const stats = ["hp", "atk", "def", "spa", "spd", "spe"];
    const { breeder, index, deletePoke } = this.props;
    const { url } = this.state;

    return (
      <div key={index} className="card col-3 d-inline-block p-3">
        <p>{breeder.name}</p>
        <img src={url} alt="not found" />
        <div className="row">
          {stats.map((stat, index) => (
            <div
              className="col-2 d.inline-block"
              style={{ padding: "1px" }}
              key={index}
            >
              <React.Fragment>
                {breeder[stat] === true ? (
                  <FontAwesomeIcon
                    icon={faCheckSquare}
                    style={{ color: "limegreen" }}
                  ></FontAwesomeIcon>
                ) : (
                  <FontAwesomeIcon
                    icon={faMinusSquare}
                    style={{ color: "tomato" }}
                  ></FontAwesomeIcon>
                )}
                <p>
                  31<br></br>
                  {stat}
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
