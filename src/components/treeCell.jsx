import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getImgSm } from "../utils/pokeApi";
import { capitalize } from "../utils/capitalize";
import { genderIcons } from "../utils/remap";

class TreeCell extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

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
    const { name, ivs, breeder } = this.props.item;
    if (breeder) {
      return { value: "breeder", class: "border-success" };
    } else if (Object.keys(ivs).every((k) => !ivs[k])) {
      return { value: "empty", class: "" };
    } else if (name) {
      return { value: "target", class: "border-info" };
    }
    return { value: "generated", class: "border-warning" };
  };

  getCoordinates = (level, index) => {
    let box = this.inputRef.current.getBoundingClientRect();
    let { x, y, width, height } = box;
    const coords = {
      x: x + width / 2,
      y: y + height / 2,
      left: x,
      right: x + width,
      type: this.state.type.value,
    };
    this.props.logCoordinates(coords, level, index);
  };

  async componentDidMount() {
    const { level, index } = this.props;
    const url = await this.getUrl();
    const type = this.getType();
    this.setState({ url, type });
    this.getCoordinates(level, index);
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
    const { name, ivs, gender } = this.props.item;
    const { url, type } = this.state;
    const stats = Object.keys(target.active);
    const activeStats = stats.filter((stat) => target.active[stat] === true);

    return (
      <div
        ref={this.inputRef}
        className={`treeCell card text-center d-flex justify-content-center ${
          type ? type.class : null
        }`}
      >
        <div>
          {name && (
            <div>
              {gender && (
                <FontAwesomeIcon
                  className="mr-1"
                  icon={genderIcons[gender].icon}
                  style={{
                    color: `${genderIcons[gender].color}`,
                  }}
                ></FontAwesomeIcon>
              )}
              <small>{capitalize(name)}</small>
            </div>
          )}
          <div className="iconParent">
            {url && <img src={url} alt="icon" />}
          </div>
        </div>

        <div className="row">
          {activeStats.map(
            (stat) =>
              ivs[stat] && (
                <div
                  key={stat}
                  className={`col-lg-${Math.max(12 / level, 4)} d-inline-block`}
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
