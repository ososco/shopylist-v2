import React, { Component } from "react";

class Lists extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const {
      currentList,
      listNameInput,
      handleChange,
      addlist,
      userLists,
      sharedLists,
      setCurrentList
    } = this.props;
    return (
      <div>
        <div className="section">
          <div className="lists-list">
            <h3>My lists</h3>
            <ul className="listLists">
              {userLists.map(e => (
                <li
                  className={e.key === currentList ? "selected" : ""}
                  key={e.key}
                  onClick={() => setCurrentList(e.key)}
                >
                  {e.name}
                </li>
              ))}
            </ul>
            <h3 className="twentyfive-up">Shared lists</h3>
            <ul className="listLists">
              {sharedLists.map(e => (
                <li
                  className={e.key === currentList ? "selected" : ""}
                  key={e.key}
                  onClick={() => setCurrentList(e.key)}
                >
                  {e.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="section">
          <h3>Create new list</h3>
          <input
            className="input-primary"
            name="listNameInput"
            type="text"
            placeholder="List name"
            onChange={handleChange}
          />
          <div className="btn-right">
            <button
              className="primary-btn"
              onClick={() => addlist(listNameInput)}
            >
              Add list
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default Lists;
