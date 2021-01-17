import React, { Component } from "react";
import { getImgSm } from "../utils/pokeApi";
import { capitalize } from "../utils/capitalize";

class TreeCell extends Component {
  state = {
    url: "",
    type: {},
  };

  getUrl = async () => {
    const { name } = this.props.item;
    let newUrl = "";
    if (name) {
      newUrl = await getImgSm(name.toLowerCase());
    }
    return newUrl;
  };

  getType = () => {
    const { name, ivs } = this.props.item;
    if (name) {
      return { value: "breeder", class: "border-success" };
    } else if (Object.keys(ivs).every((k) => !ivs[k])) {
      return { value: "empty", class: "" };
    }
    return { value: "generated", class: "border-warning" };
  };

  getCoordinates = () => {
    let box = this.getBoundingClientRect();
    console.log("top", box.top);
    console.log("bottom", box.bottom);
    console.log("left", box.left);
  };

  async componentDidMount() {
    const url = await this.getUrl();
    const type = this.getType();
    this.setState({ url, type });
    this.getCoordinates();
  }

  async componentDidUpdate() {
    const url = await this.getUrl();
    const type = this.getType();
    if (url !== this.state.url) {
      this.setState({ url });
    }
    if (type.value !== this.state.type.value) {
      this.setState({ type });
    }
  }

  render() {
    const { target, level } = this.props;
    const { name, ivs } = this.props.item;
    const { url, type } = this.state;
    const stats = Object.keys(target.active);
    const activeStats = stats.filter((stat) => target.active[stat] === true);

    return (
      <div
        className={`treeCell card text-center d-flex justify-content-center ${
          type ? type.class : null
        }`}
      >
        <div>
          {name && <small>{capitalize(name)}</small>}
          <div className="iconParent">
            {url && <img src={url} alt="icon" />}
          </div>
        </div>

        <div className="row">
          {activeStats.map(
            (stat) =>
              ivs[stat] && (
                <div
                  className={`col-md-${Math.max(12 / level, 4)} d-inline-block`}
                >
                  <div>
                    <small>
                      {target.data[stat]} {stat.toUpperCase()}
                    </small>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    );
  }
}

export default TreeCell;
