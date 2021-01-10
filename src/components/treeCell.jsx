import React, { Component } from "react";
import { getImgSm } from "../utils/pokeApi";

class TreeCell extends Component {
  state = {
    url: "",
    type: {},
  };

  async getUrl() {
    const { name } = this.props.item;
    let newUrl = "";
    if (name) {
      newUrl = await getImgSm(name.toLowerCase());
    }
    return newUrl;
  }

  getType() {
    const { name, ivs } = this.props.item;
    if (name) {
      return { value: "breeder", class: "border-success" };
    } else if (Object.keys(ivs).every((k) => !ivs[k])) {
      return { value: "empty", class: "" };
    }
    return { value: "generated", class: "border-warning" };
  }

  async componentDidMount() {
    const url = await this.getUrl();
    const type = this.getType();
    this.setState({ url, type });
  }

  async componentDidUpdate() {
    const url = await this.getUrl();
    const type = this.getType();
    if (url !== this.state.url) {
      this.setState({ url, type });
    }
  }

  render() {
    const { target } = this.props;
    const { name, ivs } = this.props.item;
    const { url, type } = this.state;
    const stats = ["hp", "atk", "def", "spa", "spd", "spe"];

    return (
      <div className={`card my-2 text-center ${type ? type.class : null}`}>
        {type.value === "empty" ? (
          <div>
            <br></br>
          </div>
        ) : null}
        {name && (
          <div>
            {name}
            <div className="iconParent">
              {url && <img src={url} alt="icon" />}
            </div>
          </div>
        )}
        {stats.map(
          (stat) =>
            ivs[stat] && (
              <div>
                {target.data[stat]} {stat.toUpperCase()}{" "}
              </div>
            )
        )}
      </div>
    );
  }
}

export default TreeCell;
