import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Autosuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import { suggestions } from "../helpers/suggestions.js";
import autoBind from "react-autobind";

//*********************************/
//    react-autosuggest
//*********************************/

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === "") {
    return [];
  }

  const regex = new RegExp("^" + escapedValue, "i");

  return suggestions.filter(item => regex.test(item));
}

function getSuggestionValue(suggestion) {
  return suggestion;
}

function renderSuggestion(suggestion, { query }) {
  const matches = AutosuggestHighlightMatch(suggestion, query);
  const parts = AutosuggestHighlightParse(suggestion, matches);

  return (
    <span>
      {parts.map((part, index) => {
        const className = part.highlight
          ? "react-autosuggest__suggestion-match"
          : null;

        return (
          <span className={className} key={index}>
            {part.text}
          </span>
        );
      })}
    </span>
  );
}

//*********************************/
//    react-beautiful-dnd
//*********************************/

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 3;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "#f7f7f7",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "#919499" : null
});

//*********************************/

class Items extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      value: "",
      suggestions: []
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    autoBind(this);
  }

  componentDidMount() {
    this.setState({ items: this.props.items });
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.props.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });

    this.props.updateAllItems(items);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (e.keyCode === 13 && e.target.value) {
      this.props.addItem(this.capFirst(e.target.value));
      this.setState({ value: "" });
      // e.target.value = "";
    }
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  capFirst(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.props.addItem(suggestion);
    this.setState({ value: "" });
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Item name...",
      value,
      onChange: this.onChange,
      onKeyUp: this.handleSubmit
    };
    return (
      <div className="items-list-div">
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          inputProps={inputProps}
        />
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {this.props.items.length > 0
                  ? this.props.items.map((item, index) => (
                      <Draggable
                        draggable={true}
                        key={item.key}
                        draggableId={item.key}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={
                              item.done
                                ? "items-list-item crossed"
                                : "items-list-item"
                            }
                            draggable="true"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <span
                              onClick={() => this.props.crossItem(item.key)}
                            >
                              {item.name}
                            </span>

                            <button
                              onClick={() => this.props.deleteItem(item.key)}
                              className="items-list-btn"
                            />
                          </div>
                        )}
                      </Draggable>
                    ))
                  : null}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="clear-btns-div">
          <button
            className="primary-btn btn-danger"
            onClick={this.props.deleteCrossedItems}
          >
            Clear crossed
          </button>
          <button
            className="primary-btn btn-danger"
            onClick={this.props.deleteAllItems}
          >
            Clear all
          </button>
        </div>
      </div>
    );
  }
}

export default Items;
