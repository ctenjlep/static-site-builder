import React, { Component } from "react";
import { connect } from "react-redux";
import "./TreeViz.css";

class UnconnectedTreeVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: {}
    };
  }
  
  isThisSelected = (selectedLocation, thisLocation) => {
    if (selectedLocation === thisLocation) {
      return "selectedHighlight openBranch";
    }

    return "";
  };

  isThisOpened = location => {
    let opened = this.state.opened;
    if (opened[location] === true) {
      console.log(this.state);
      return "hasChildrenAndSelected openBranch";
    }

    return "";
  };

  doesThisHaveChildren = (tree, location) => {
    if (
      tree.children.length !== 0 &&
      this.props.selectedLocation !== location
    ) {
      return "hasChildren";
    }
    if (
      tree.children.length !== 0 &&
      this.props.selectedLocation === location
    ) {
      return "hasChildrenAndSelected";
    }
    return "";
  };

  toggleOpened = currentLocation => {
    console.log(currentLocation);
    console.log(this.state.opened.currentLocation);
    let opened = this.state.opened;
    console.log({ opened });
    if (opened[currentLocation] === true) {
      console.log("closing");
      this.setState(prevState => ({
        opened: { ...prevState.opened, [currentLocation]: false }
      }));
      console.log("state w closed", this.state.opened);
      return;
    }
    this.setState(prevState => ({
      opened: { ...prevState.opened, [currentLocation]: true }
    }));
  };

  visualizeTree = (tree, location) => {
    let displayChild = child => {
      if (child.tagName) {
        return child.tagName;
      }
      if (child.length === 0) {
        return "empty div";
      } else {
        return child;
      }
    };
    if (tree.tagName !== undefined && tree.children.length !== 0) {
      return React.createElement(
        "div",
        {
          //style: tree.css,
          href: "#",
          className:
            this.isThisSelected(this.props.selectedLocation, location) +
            " " +
            "inner",
          onClick: event => {
            event.stopPropagation();
            //this.toggleOpened(location);
            this.props.dispatch({ type: "set-location", location: location });
          }
        },
        tree.children.map((ch, index) => {
          if (ch.tagName !== undefined) {
            return React.createElement(
              "div",
              {
                className:
                  "inner" + " " + this.doesThisHaveChildren(ch, location)
              },
              [
                displayChild(ch),
                React.createElement(
                  "div",
                  {
                    onClick: event => {
                      //this.toggleOpened(location);
                      console.log(location);
                      event.stopPropagation();
                      this.props.dispatch({
                        type: "set-location",
                        location: location.concat(index)
                      });
                    },
                    className:
                      this.isThisSelected(
                        this.props.selectedLocation,
                        location
                      ) +
                      //this.isThisOpened(location) +
                      " " +
                      "outer"
                  },
                  this.visualizeTree(ch, location.concat(index))
                )
              ]
            );
          } else {
            console.log("hit");
            return React.createElement(
              "div",
              {
                className:
                  this.isThisSelected(this.props.selectedLocation, location) +
                  //this.isThisOpened(location) +
                  " " +
                  "inner"
              },
              displayChild(ch)
            );
          }
        })
      );
    }
    if (tree.children.length === 0) {
      return React.createElement(
        "div",
        {
          //style: tree.css,
          href: "#",
          className:
            this.isThisSelected(this.props.selectedLocation, location) +
            " " +
            "inner" +
            " hasChildrenAndSelected",
          onClick: event => {
            event.stopPropagation();
            //this.toggleOpened(location);
            this.props.dispatch({ type: "set-location", location: location });
          }
        },
        ""
      );
    }
    return tree;
  };

  render() {
    return (
      <div className="outer">{this.visualizeTree(this.props.tree, "")}</div>
    );
  }
}

let mapStateToProps = state => ({
  tree: state.tree,
  selectedLocation: state.location
});

let TreeVisualizer = connect(mapStateToProps)(UnconnectedTreeVisualizer);

export default TreeVisualizer;
