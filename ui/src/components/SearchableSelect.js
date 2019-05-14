// Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
// Team Name: Team 14
// Team Members:
//   Dading Zainal Gusti (1001261)
//   David Setyanugraha (867585)
//   Ghawady Ehmaid (983899)
//   Indah Permatasari (929578)
//   Try Ajitiono (990633)

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import FormHelperText from '@material-ui/core/FormHelperText';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';

import { emphasize } from '@material-ui/core/styles/colorManipulator';

import CancelIcon from '@material-ui/icons/Cancel';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  inputBase: {
    height: '100%',
    background: '#eee',
    boxShadow: theme.custom.boxShadow,
    borderRadius: 10
  },
  input: {
    display: 'flex',
    padding: 0,
    disableUnderline: true,
    height: '100%'
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    position: 'relative'
  },
  startAdornment: {
    marginLeft: theme.spacing.unit,
    cursor: 'default'
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  multiValueChip: {
    height: 24
  },
  multiValueIcon: {
    fontSize: 16
  },
  placeholder: {
    position: 'absolute',
    fontSize: 16
  },
  formControlRoot: {
    height: '100%'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  errorText: {
    color: '#f44336'
  }
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      <props.selectProps.noOptionsMessage />
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      className={props.selectProps.customClasses.formControl}
      InputProps={{
        inputComponent,
        className: classnames(
          props.selectProps.classes.inputBase,
          props.selectProps.customClasses.inputBase
        ),
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        },
        disableUnderline: true
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
        fontSize: 13,
        padding: 4
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classnames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
        [props.selectProps.customClasses.chip]: true
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={
        <CancelIcon
          {...props.removeProps}
          className={props.selectProps.customClasses.icon}
        />
      }
    />
  );
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

const selectComponents = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  ValueContainer
};

function SearchableSelect({
  classes,
  customClasses,
  label,
  onChange,
  value,
  options,
  multiple,
  isLoading,
  placeholder,
  errorText,
  disabled
}) {
  const hasError = errorText !== '';

  return (
    <div className={classes.root}>
      <Select
        classes={classes}
        styles={{
          container: base => ({
            ...base,
            height: '100%'
          })
        }}
        textFieldProps={{
          label: label,
          // This is just a placeholder so the label will always float.
          value: 'some-random-string',
          error: hasError
        }}
        menuPortalTarget={document.querySelector('body')}
        customClasses={{
          formControl: classes.formControlRoot,
          inputBase: customClasses.inputBase,
          chip: classes.multiValueChip,
          icon: classes.multiValueIcon,
          startAdornment: classes.startAdornment
        }}
        noOptionsMessage={() =>
          isLoading ? 'Fetching...' : 'No options available.'
        }
        options={options}
        placeholder={placeholder}
        components={selectComponents}
        value={value}
        onChange={onChange}
        isMulti={multiple}
        isDisabled={disabled}
      />
      {errorText && (
        <FormHelperText className={classes.errorText}>
          {errorText}
        </FormHelperText>
      )}
    </div>
  );
}

SearchableSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  customClasses: PropTypes.object,
  onChange: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  errorText: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.arrayOf(PropTypes.string)
  ]),
  options: PropTypes.array,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool
};

SearchableSelect.defaultProps = {
  label: '',
  customClasses: {},
  placeholder: ' ',
  errorText: '',
  onChange: undefined,
  value: undefined,
  options: undefined,
  multiple: false,
  disabled: false,
  isLoading: false
};

export default withStyles(styles)(SearchableSelect);
