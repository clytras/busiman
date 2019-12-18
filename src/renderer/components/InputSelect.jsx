import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import nanoid from 'nanoid';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';


export default function({
  className,
  label,
  helperText,
  value: passedValue,
  values,
  texts,
  disabled = false,
  error = false,
  onChange,
  inputProps
}) {
  const classes = useStyles();
  const [value, setValue] = useState(passedValue === undefined && '');
  const [internalId] = useState(nanoid());

  useEffect(() => {
    console.log('input select useEffect', passedValue);
    setValue(passedValue);
  }, [passedValue]);

  function handleChange({ target: { value }}) {
    if(passedValue === undefined) {
      setValue(value);
    }
    onChange && onChange(value);
  }

  let { name, id } = inputProps || {};

  !id && (id = `input-select-${internalId}`);
  !name && (name = id);

  console.log('input select render', passedValue, value);

  return (
    <FormControl className={className} error={error}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        value={value}
        disabled={disabled}
        onChange={handleChange}
        inputProps={{ name, id }}
      >
        {values.map((v, i) => v ? (
          <MenuItem dense key={`${id}-item-${v}`} value={v}>{v in texts ? texts[v] : texts[i]}</MenuItem>
        ) : (
          <Divider key={`${id}-devider-${i}`} className={classes.divider}/>
        ))}
      </Select>
      {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(.5, 0)
  },
}));
