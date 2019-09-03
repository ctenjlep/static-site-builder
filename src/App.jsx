import React, { Component } from "react";
import { connect } from "react-redux";
import MakeElement from "./components/MakeElement.jsx";
import TreeVisualizer from "./components/TreeVisualizer.jsx";
import formattedTags from "../sideWork/tags.jsx";
import Tree from "./components/Tree.jsx";
import { produce } from "immer";

class UnconnectedApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productionTree: "",
      treeVisible: true,
      elementMakerVisible: true,
      selectedCss: {}
    };
  }

  componentDidUpdate() {}

  hideTree = async event => {
    if (this.state.treeVisible === false) {
      this.setState({ treeVisible: true });
      return;
    } else {
      this.setState({ treeVisible: false });
    }
  };

  hideElementMaker = async event => {
    if (this.state.elementMakerVisible === false) {
      this.setState({ elementMakerVisible: true });
      return;
    } else {
      this.setState({ elementMakerVisible: false });
    }
  };

  ElementMakerClassSwitch = () => {
    if (this.state.elementMakerVisible === true) {
      return "spaceBetween";
    } else {
      return "hide";
    }
  };

  TreeVisualizerClassSwitch = () => {
    if (this.state.treeVisible === true) {
      return "";
    } else {
      return "hide";
    }
  };

  isThisSelected = (selectedLocation, thisLocation) => {
    if (selectedLocation === thisLocation) {
      return "selectedHighlight";
      console.log("selected location", selectedLocation);
    }
    return "";
  };

  convert = (tree, location) => {
    if (tree.tagName !== undefined && tree.tagName !== "img") {
      return React.createElement(
        tree.tagName,
        {
          style: tree.css,
          src: tree.src,
          href: tree.href,
          className: this.isThisSelected(this.props.location, location),
          onClick: event => {
            event.stopPropagation();
            this.props.dispatch({
              type: "store-node-props",
              location: location,
              css: tree.css,
              href: tree.href,
              src: tree.src
            });
          },
          key: location
        },
        tree.children.map((ch, index) =>
          this.convert(ch, location.concat(index))
        )
      );
    }
    if (tree.tagName === "img") {
      return React.createElement(tree.tagName, {
        style: tree.css,
        src: tree.src,
        href: tree.href,
        className: this.isThisSelected(this.props.location, location),
        onClick: event => {
          event.stopPropagation();
          this.props.dispatch({
            type: "store-node-props",
            location: location,
            css: tree.css,
            href: tree.href,
            src: tree.src
          });
        },
        key: location
      });
    }
    return tree;
  };

  renderDiv = element => {
    if (element.css) {
      return <div style={element.css}>{element.innerText}</div>;
    } else {
      return <div>{element.innerText}</div>;
    }
  };
  renderImg = (location, element) => {
    return <img style={element.css} src={element.src} />;
  };

  origin = "";
  render = () => {
    return (
      <div>
        <div className="posAbs fullWidth">
          <div className="lessMargin">
            <h1 className="centerText ">BUILDER</h1>
          </div>
          <h5>you have selected: {this.props.location}</h5>
          <div>{JSON.stringify(this.props.css, null, 2)}</div>
          <div className={this.ElementMakerClassSwitch()}>
            <MakeElement />
          </div>
          <div className="Tree">
            <Tree />
          </div>
          <div className="flexColumn">
            <div className={this.TreeVisualizerClassSwitch()}>
              {/* <div className="treeVisualizer">
                <TreeVisualizer />
              </div>
    */}
            </div>
            <div className="relative flexEven underTree">
              <button className="myButton" onClick={this.hideTree}>
                Toggle Tree Display
              </button>
              <button className="myButton" onClick={this.hideElementMaker}>
                Toggle Element Creator Display
              </button>
            </div>
          </div>
          <div className="posAbs">
            {this.convert(this.props.tree, this.origin)}
          </div>
        </div>
        {/*<iframe className="iframeSite" src="https://www.ssense.com/en-ca" />*/}
      </div>
    );
  };
}

let mapStateToProps = state => ({
  tree: state.tree,
  location: state.location,
  css: state.css,
  href: state.href,
  src: state.src
});

let App = connect(mapStateToProps)(UnconnectedApp);

export default App;
