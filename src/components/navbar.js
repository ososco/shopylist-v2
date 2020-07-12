import React, { Component } from "react";
import {
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineSolution,
  AiOutlineLogout
} from "react-icons/ai";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { tab } = this.props;
    return (
      <div className="bottom-nav">
        <div
          onClick={() => this.props.setTab("items")}
          className="bottom-nav-item"
        >
          <div
            className={
              tab === "items"
                ? "bottom-nav-item-content bottom-nav-item-active"
                : "bottom-nav-item-content"
            }
          >
            <AiOutlineShoppingCart /> <p>Items</p>
          </div>
        </div>
        <div
          onClick={() => this.props.setTab("list")}
          className="bottom-nav-item"
        >
          <div
            className={
              tab === "list"
                ? "bottom-nav-item-content bottom-nav-item-active"
                : "bottom-nav-item-content"
            }
          >
            <AiOutlineMenu /> <p>List</p>
          </div>
        </div>
        <div
          onClick={() => this.props.setTab("lists")}
          className="bottom-nav-item"
        >
          <div
            className={
              tab === "lists"
                ? "bottom-nav-item-content bottom-nav-item-active"
                : "bottom-nav-item-content"
            }
          >
            <AiOutlineSolution /> <p>Lists</p>
          </div>
        </div>
        <div onClick={() => this.props.logout()} className="bottom-nav-item">
          <div className="bottom-nav-item-content">
            <AiOutlineLogout />
            <p>Logout</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
