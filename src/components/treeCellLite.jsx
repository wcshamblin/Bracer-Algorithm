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
    const { name } = this.props.poke;
    let newUrl = "";
    if (name) {
      newUrl = await getImgSm(name.toLowerCase());
    }
    return newUrl;
  };

  getType = () => {
    return { value: "target", class: "border-info" };
  };

  async componentDidMount() {
    const url = await this.getUrl();
    const type = this.getType();
    this.setState({ url, type });
  }

  async componentDidUpdate() {
    const url = await this.getUrl();
    if (url !== this.state.url) {
      this.setState({ url });
    }
  }

  render() {
    const { target } = this.props;
    const { name, ivs, gender } = this.props.poke;
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
                <div key={stat} className={`col-lg-6 d-inline-block`}>
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
