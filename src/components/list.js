import React, { Component } from "react";
import autoBind from "react-autobind";
import Select from "react-select";
import EditableLabel from "./macro/EditableLabel";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersList: [],
      isOwner: false
    };
    autoBind(this);
  }

  componentDidMount() {
    this.setState({
      usersList: this.mapUsersList(),
      sharedList: this.mapSharedUsers(),
      isOwner:
        this.props.user === this.getUserById(this.props.currentListInfo.owner)
          ? true
          : false
    });
  }

  getUserById(id) {
    return this.props.usersList.filter(e => e[id])[0][id];
  }

  // Create list of all users exluding logged in user, with key and value pairs
  // Used in Select elements to display names while sending id to database
  mapUsersList() {
    const { usersList, user } = this.props;

    return usersList
      .map((e, i) => ({
        value: Object.keys(usersList[i])[0],
        label: Object.values(usersList[i])[0]
      }))
      .filter(e => e.label !== user);
  }

  // Get list of of usres this list is shaerd with, exluding logged in user
  // Used for suggested users in Select element
  mapSharedUsers() {
    const { users } = this.props.currentListInfo;
    return this.mapUsersList().filter(e => users.includes(e.value));
  }

  // Select element on change (adding or removing users)
  // returns an array of users and replace current list/users object in database (shareListWithUsers)
  onChange(value) {
    this.props.shareListWithUsers(
      this.props.currentList,
      value ? value.map(e => e.value) : []
    );
  }

  render() {
    const { isOwner, usersList, sharedList } = this.state;
    const {
      currentListInfo,
      leaveSharedList,
      deleteList,
      changeListName
    } = this.props;
    return currentListInfo ? (
      <div>
        <div className="section">
          <h3>List details:</h3>
          <p>
            List name:{" "}
            {isOwner ? (
              <EditableLabel
                initialValue={currentListInfo.name}
                save={value => changeListName(value)}
                labelClass="section-label"
                inputClass="section-input"
              />
            ) : (
              currentListInfo.name
            )}
          </p>

          <p>Owner: {this.getUserById(currentListInfo.owner)}</p>
        </div>
        {isOwner ? (
          <div>
            <div className="section">
              <h3>Shared with:</h3>

              <div>
                <Select
                  className="multi-select"
                  classNamePrefix="react-select"
                  options={usersList}
                  isMulti
                  isSearchable={false}
                  placeholder="Select user..."
                  defaultValue={sharedList}
                  onChange={this.onChange}
                />
              </div>
            </div>
            {!currentListInfo.defaultList ? (
              <div className="section">
                <h3>Delete list</h3>
                <div className="btn-center">
                  <button
                    className="primary-btn btn-75 btn-danger"
                    onClick={deleteList}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="section">
            <h3>Leave list</h3>
            <div className="btn-center">
              <button
                className="primary-btn btn-75 btn-danger"
                onClick={leaveSharedList}
              >
                Leave
              </button>
            </div>
          </div>
        )}
      </div>
    ) : null;
  }
}

export default List;
