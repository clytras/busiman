import React, { useState, useEffect } from 'react';
import nanoid from 'nanoid';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';


export default function({
  className,
  label,
  helperText,
  value: passedValue = '',
  showPassword: passedShowPassword = false,
  hideIfDisabled = true,
  disabled = false,
  error = false,
  onChange,
  inputProps
}) {
  const [value, setValue] = useState(passedValue);
  const [showPassword, setShowPassword] = useState(passedShowPassword);
  const [internalId] = useState(nanoid());

  useEffect(() => setValue(passedValue), [passedValue]);
  useEffect(() => {
    if(passedShowPassword !== null) {
      setShowPassword(passedShowPassword);
    }
  }, [passedShowPassword]);

  function handleChange({ target: { value }}) {
    setValue(value);
    onChange && onChange(value);
  }

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleMouseDownPassword(event) {
    event.preventDefault();
  }

  let { name, id } = inputProps || {};

  !id && (id = `input-password-${internalId}`);
  !name && (name = id);

  const passwordVisibility = showPassword && !(disabled && hideIfDisabled);

  return (
    <FormControl className={className} error={error}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Input
        id={id}
        name={name}
        type={passwordVisibility ? 'text' : 'password'}
        value={(!passwordVisibility && disabled) ? 'x'.repeat(value.length) : value}
        disabled={disabled}
        onChange={handleChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              disabled={disabled}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {passwordVisibility ? <VisibilityIcon fontSize="small"/> : <VisibilityOffIcon fontSize="small"/>}
            </IconButton>
          </InputAdornment>
        }
      />
      {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
