import React, { Component } from "react";
import { connect } from "react-redux";
import formattedTags from "../../sideWork/tags.jsx";
import "./MakeElement.css";

class UnconnectedMakeElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      css: "",
      location: "",
      text: "",
      href: "",
      src: "",
      useSelectedLocation: false,
      usePreviousCss: false
    };
  }

  changeType = event => {
    this.setState({ type: event.target.value });
  };
  changeCss = event => {
    this.setState({ css: event.target.value });
  };
  changeLocation = event => {
    this.setState({ location: event.target.value });
  };
  changeText = event => {
    this.setState({ text: event.target.value });
  };
  changeHref = event => {
    this.setState({ href: event.target.value });
  };
  changeSrc = event => {
    this.setState({ src: event.target.value });
  };

  createElem = (tagName, elemCss, href, src) => {
    if (this.state.text !== "") {
      return {
        tagName: tagName,
        children: [this.state.text],
        css: elemCss,
        href: href,
        src: src
      };
    } else {
      return {
        tagName: tagName,
        children: [],
        css: elemCss,
        href: href,
        src: src
      };
    }
  };

  useLocationFromStore = async event => {
    await this.setState({ useSelectedLocation: event.target.checked });
  };
  usePreviousCss = async event => {
    await this.setState({ usePreviousCss: event.target.checked });
  };
  ///[1,2,3,4]
  addChild = (tree, location, newChild) => {
    console.log(tree);
    ///when we are at the 'end' of the location coordinates, we can concat the new child to currrent children
    if (location.length === 0) {
      console.log("success", tree.children);
      return { ...tree, children: tree.children.concat(newChild) };
    }
    let newChildren = [...tree.children];
    let newParent = newChildren[location[0]];
    newParent = this.addChild(newParent, location.slice(1), newChild);
    //this only happens after the end of the location has been hit, so you are already somewhere with known children
    newChildren[location[0]] = newParent;
    return { ...tree, children: newChildren };
  };

  updateCssOfANestedElement = (tree, location, css) => {
    console.log({ tree });
    console.log({ location });
    ///when we are at the 'end' of the location coordinates, we can concat the new child to currrent children
    if (location.length === 0) {
      console.log("success", tree.children);
      if (this.state.usePreviousCss === false) {
        return { ...tree, css: css };
      } else {
        let oldCss = tree.css;
        let newCss = Object.assign({}, oldCss, css);
        return { ...tree, css: newCss };
      }
    }
    let newChildren = [...tree.children];
    let newParent = newChildren[location[0]];
    newParent = this.updateCssOfANestedElement(
      newParent,
      location.slice(1),
      css
    );
    //this only happens after the end of the location has been hit, so you are already somewhere with known children
    newChildren[location[0]] = newParent;
    return { ...tree, children: newChildren };
  };

  updateCss = event => {
    event.preventDefault();
    let cssArray = this.state.css.split(",");
    let cssObj = {};
    cssArray.forEach(elem => {
      let splitElem = elem.split(":");
      cssObj[splitElem[0]] = splitElem[1];
    });
    let locationSelected = this.state.location.split("");
    if (this.state.useSelectedLocation) {
      locationSelected = this.props.selectedLocation;
    }
    let tree = this.props.tree;
    console.log("selected location", locationSelected);
    let updatedTree = this.updateCssOfANestedElement(
      tree,
      locationSelected,
      cssObj
    );
    this.props.dispatch({ type: "addChildToTree", tree: updatedTree });
  };

  build = async event => {
    event.preventDefault();
    console.log(this.state);
    let location = this.state.location.split("");
    if (this.state.useSelectedLocation) {
      location = this.props.selectedLocation;
    }
    console.log(location);
    let cssArray = this.state.css.split(",");
    let cssObj = {};
    cssArray.forEach(elem => {
      let splitElem = elem.split(":");
      cssObj[splitElem[0]] = splitElem[1];
    });
    let tree = this.props.tree;
    if (this.state.type === "") {
      let childString = this.state.text;
      let updatedTree = this.addChild(tree, location, childString);
      this.props.dispatch({ type: "addChildToTree", tree: updatedTree });
      return;
    }
    let newElem = this.createElem(
      this.state.type,
      cssObj,
      this.state.href,
      this.state.src
    );
    let newTree = this.addChild(tree, location, newElem);
    this.props.dispatch({ type: "addChildToTree", tree: newTree });
  };
  render() {
    return (
      <div>
        <form onSubmit={this.build}>
          <div className="smallPad horizontalSpace reflex">
            <div>
              Type:{" "}
              <input
                className="formTextInput"
                type="text"
                onChange={this.changeType}
                value={this.state.type}
              />
            </div>
            <div>
              CSS:{" "}
              <input
                className="formTextInput"
                type="text"
                onChange={this.changeCss}
                value={this.state.css}
              />
            </div>
            <div>
              Location:{" "}
              <input
                className="formTextInput"
                type="text"
                onChange={this.changeLocation}
                value={this.state.location}
              />
            </div>
          </div>
          <div className="smallPad horizontalSpace">
            <div>
              Src:{" "}
              <input
                className="formTextInput"
                type="text"
                onChange={this.changeSrc}
                value={this.state.src}
              />
            </div>
            <div>
              Href:{" "}
              <input
                className="formTextInput"
                type="text"
                onChange={this.changeHref}
                value={this.state.href}
              />
            </div>
            <div>
              Text Child:{" "}
              <input
                className="formTextInput"
                type="text"
                onChange={this.changeText}
                value={this.state.text}
              />
            </div>
          </div>
          <div className="smallPad smallMargin">
            Use Selected Location:{" "}
            <input
              className="formTextInput"
              type="checkbox"
              onChange={this.useLocationFromStore}
              value={this.state.useSelectedLocation}
            />
            Add To Old Css:{" "}
            <input
              className="formTextInput"
              type="checkbox"
              onChange={this.usePreviousCss}
              value={this.state.usePreviousCss}
            />
          </div>
          <button className="myButton" type="button" onClick={this.updateCss}>
            Update CSS
          </button>
          <input className="myButton" type="submit" />
        </form>
      </div>
    );
  }
}

let mapStateToProps = state => ({
  tree: state.tree,
  selectedLocation: state.location
});

let MakeElement = connect(mapStateToProps)(UnconnectedMakeElement);

export default MakeElement;
