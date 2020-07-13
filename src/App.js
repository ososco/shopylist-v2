import React, { Component } from "react";
import autoBind from "react-autobind";
//import firebase from "firebase";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { config } from "./helpers/config.js";
import { snapshotToArray, mapSnapshotToArray } from "./helpers";
import Header from "./components/header";
import Navbar from "./components/navbar";
import Login from "./components/login";
import Items from "./components/items";
import List from "./components/list";
import Lists from "./components/lists";

import "./styles.css";

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const database = firebase.database();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "items",
      emailInput: "",
      passwordInput: "",
      listNameInput: "",
      user: "guest",
      userLists: [],
      sharedLists: [],
      items: [],
      currentList: ""
    };
    autoBind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          const { displayName, uid } = firebase.auth().currentUser;

          this.setState({
            user: displayName,
            userid: uid,
            isLoggedin: true
          });
          let userRef = database.ref("users/" + uid + "/lastOpenedList");
          userRef.on("value", snapshot => {
            this.setState({
              lastOpenedList: snapshot.val(),
              currentList: snapshot.val()
            });
            this.getCurrentlistInfo(snapshot.val());
            this.getItems(snapshot.val());
          });
          this.getUserLists(uid);
          this.getUsersList();
        } else {
          this.setState({ isLoggedin: false });
          console.log("guest");
        }
      }.bind(this)
    );
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  setTab(tab) {
    this.setState({ tab: tab });
  }

  login() {
    auth
      .signInWithEmailAndPassword(
        this.state.emailInput,
        this.state.passwordInput
      )
      .then((cred, error) => {
        if (error) {
          alert(error.message);
        }
        this.setState({ isLoggedin: true });
      });
  }

  logout() {
    this.setState({ user: "guest", isLoggedin: false });
    firebase
      .auth()
      .signOut()
      .then(function() {
        console.lgo("Sign-out successful.");
      })
      .catch(function(error) {
        // An error happened.
      });
  }

  addUsers() {
    database.ref("users").set({
      LlhqOSQWqOWi5a86h33Rf91W5Yh2: {
        displayName: "Osama"
      },
      Bal4lZiMKvgSqcbhTcK4jC3VRql1: {
        displayName: "Ieva"
      }
    });
  }

  addlist(name) {
    let user = firebase.auth().currentUser.uid;
    let listsRef = database.ref("lists");

    let listsCount = this.state.userLists.length + 1;

    let listData = {
      name: !name ? "List " + listsCount : name,
      owner: user,
      defaultList: false
    };

    listsRef.push(listData);
  }

  changeListName(value) {
    const { currentList } = this.state;
    let itemsRef = database.ref("lists/" + currentList);

    itemsRef.update({ name: value });
  }

  getUserLists(user) {
    let listsRef = database.ref("lists");
    let userLists = listsRef.orderByChild("owner").equalTo(user);
    let sharedRef = listsRef.orderByChild("users/" + user).equalTo(true);

    userLists.on("value", snapshot => {
      this.setState({ userLists: snapshotToArray(snapshot) });
    });

    sharedRef.on("value", snapshot => {
      this.setState({ sharedLists: snapshotToArray(snapshot) });
    });
  }

  shareListWithUsers(list, users) {
    let listRef = database.ref("lists/" + list);

    let item = {};
    users.forEach(user => (item[user] = true));

    listRef.child("users").set(item);
  }

  leaveSharedList() {
    const { currentList, userid } = this.state;
    let listRef = database.ref("lists/" + currentList);
    let defaultListRef = database.ref("users/" + userid + "/defaultList");

    if (window.confirm("Are you sure you want to leave this shared list?")) {
      listRef.child("users/" + userid).remove();
      defaultListRef.once("value", snapshot =>
        this.setLastOpenedList(snapshot.val())
      );
      this.setState({ tab: "lists" });
    }
  }

  deleteList() {
    const { currentList, userid } = this.state;
    let listRef = database.ref("lists/" + currentList);
    let defaultListRef = database.ref("users/" + userid + "/defaultList");

    if (window.confirm("Are you sure you want to delete this list?")) {
      defaultListRef.on("value", snapshot => {
        this.setLastOpenedList(snapshot.val());
        this.setCurrentList(snapshot.val());
      });
      this.setState({ tab: "items" });

      listRef.remove();
    }
  }

  getItems(key) {
    if (!key) {
      console.log("no key");
    }
    let itemsRef = database.ref("lists/" + key + "/items");

    itemsRef.on("value", snapshot => {
      this.setState({ items: snapshotToArray(snapshot) });
    });
  }

  updateAllItems(items) {
    let list = this.state.currentList;
    let listRef = database.ref("lists/" + list);

    listRef.update({ items });
  }

  setCurrentList(key) {
    this.setState({ currentList: key, tab: "items" });
    this.getItems(key);
    this.setLastOpenedList(key);
  }

  getCurrentlistInfo(key) {
    let listRef = database.ref("lists/" + key);
    let usersRef = database.ref("lists/" + key + "/users");

    listRef.once("value", snapshot => {
      let info = {
        name: snapshot.val().name,
        owner: snapshot.val().owner,
        defaultList: snapshot.val().defaultList,
        users: []
      };

      usersRef.once("value", snapshot => {
        snapshot.forEach(e => {
          info.users.push(e.key);
        });
      });

      this.setState({ currentListInfo: info });
    });
  }

  setLastOpenedList(key) {
    //lastOpenedList
    let { userid } = this.state;
    let userRef = database.ref("users/" + userid);
    userRef.update({ lastOpenedList: key });
    this.setState({ lastOpenedList: key });
  }

  getLastOpenedList(user) {
    let userRef = database.ref("users/" + user + "/lastOpenedList");
    userRef.on("value", snapshot => {
      this.setState({ lastOpenedList: snapshot.val() });
    });
  }

  //  **** get list of all users ****
  getUsersList() {
    let usersRef = database.ref("users/");

    usersRef.on("value", snapshot =>
      this.setState({ usersList: mapSnapshotToArray(snapshot, "displayName") })
    );
  }

  //***************************//
  //   Items list functions    //
  //***************************//

  addItem(name) {
    const { currentList } = this.state;
    let itemsRef = database.ref("lists/" + currentList + "/items");

    itemsRef.push({
      name,
      done: false
    });
  }

  crossItem(key) {
    const { currentList } = this.state;
    let itemsRef = database.ref("lists/" + currentList + "/items");

    itemsRef
      .child(key)
      .once("value")
      .then(snapshot =>
        snapshot.val().done
          ? itemsRef.child(key).update({ done: false })
          : itemsRef.child(key).update({ done: true })
      );
  }

  deleteItem(key) {
    const { currentList } = this.state;
    let itemsRef = database.ref("lists/" + currentList + "/items");

    itemsRef.child(key).remove();
  }

  deleteAllItems() {
    const { currentList } = this.state;
    let itemsRef = database.ref("lists/" + currentList + "/items");

    if (window.confirm("Do you want to clear all items?")) {
      itemsRef.remove();
    }
  }

  deleteCrossedItems() {
    const { currentList } = this.state;
    let itemsRef = database.ref("lists/" + currentList + "/items");

    if (window.confirm("Do you want to clear all crossed items?")) {
      let crossed = itemsRef.orderByChild("done").equalTo(true);
      crossed.once("value", snapshot => {
        var promises = [];
        snapshot.forEach(function(child) {
          promises.push(child.ref.remove());
        });
        Promise.all(promises); // this returns a promise that resolves once all deletes are done, or that rejects once one of them fails
      });
    }
  }

  getComponent() {
    switch (this.state.tab) {
      case "items":
        return (
          <Items
            items={this.state.items}
            addItem={name => this.addItem(name)}
            crossItem={key => this.crossItem(key)}
            deleteItem={key => this.deleteItem(key)}
            deleteAllItems={this.deleteAllItems}
            deleteCrossedItems={this.deleteCrossedItems}
            updateAllItems={items => this.updateAllItems(items)}
          />
        );
      case "list":
        return (
          <List
            shareListWithUsers={(list, users) =>
              this.shareListWithUsers(list, users)
            }
            currentList={this.state.currentList}
            user={this.state.user}
            usersList={this.state.usersList}
            currentListInfo={this.state.currentListInfo}
            leaveSharedList={this.leaveSharedList}
            deleteList={this.deleteList}
            changeListName={value => this.changeListName(value)}
          />
        );
      case "lists":
        return (
          <Lists
            currentList={this.state.currentList}
            userLists={this.state.userLists}
            sharedLists={this.state.sharedLists}
            listNameInput={this.state.listNameInput}
            handleChange={this.handleChange}
            addlist={value => this.addlist(value)}
            setCurrentList={key => this.setCurrentList(key)}
          />
        );
      default:
        return (
          <Items
            items={this.state.items}
            addItem={name => this.addItem(name)}
            crossItem={key => this.crossItem(key)}
            deleteItem={key => this.deleteItem(key)}
            deleteAllItems={this.deleteAllItems}
            deleteCrossedItems={this.deleteCrossedItems}
            updateAllItems={items => this.updateAllItems(items)}
          />
        );
    }
  }

  render() {
    const { tab, isLoggedin } = this.state;
    return (
      <div className="App">
        {!isLoggedin ? (
          <div>
            <Login login={this.login} handleChange={this.handleChange} />
          </div>
        ) : (
          <div>
            <Header />
            {/* <p>{this.state.user}</p> */}

            {this.getComponent()}

            <Navbar
              tab={tab}
              setTab={tab => this.setTab(tab)}
              logout={this.logout}
            />
          </div>
        )}
      </div>
    );
  }
}

export default App;
