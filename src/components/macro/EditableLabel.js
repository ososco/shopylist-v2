import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const EditableLabel = ({
  initialValue,
  save,
  disableKeys,
  inputClass,
  labelClass
}) => {
  const [view, setView] = useState("label");
  const [value, setValue] = useState(initialValue);
  const [previous, setPrevious] = useState(initialValue);
  const textInput = useRef(null);

  useEffect(() => {
    if (view === "text") {
      textInput.current.focus();
    }
  }, [view, textInput]);

  const keyUp = e => {
    if (disableKeys === true) {
      return;
    }

    if (e.key === "Escape") {
      setValue(previous);
      setView("label");
    } else if (e.key === "Enter") {
      setValue(e.target.value);
      setPrevious(e.target.value);
      setView("label");

      save(e.target.value);
    }
  };

  const renderLabel = () => {
    return (
      <span
        className={labelClass !== undefined ? labelClass : ""}
        onClick={e => {
          setView("text");
        }}
      >
        {value}
      </span>
    );
  };

  const renderInput = () => {
    return (
      <input
        type="text"
        value={value}
        ref={textInput}
        className={inputClass !== undefined ? inputClass : ""}
        onChange={e => {
          setValue(e.target.value);
        }}
        onBlur={e => {
          setView("label");
          setPrevious(e.target.value);

          save(e.target.value);
        }}
        onKeyUp={keyUp}
      />
    );
  };

  return view === "label" ? renderLabel() : renderInput();
};

EditableLabel.propTypes = {
  initialValue: PropTypes.string.isRequired,
  save: PropTypes.func.isRequired,
  labelClass: PropTypes.string,
  inputClass: PropTypes.string,
  disableKeys: PropTypes.bool
};

export default EditableLabel;
