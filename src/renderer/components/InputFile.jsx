import React, { useState, useLayoutEffect } from 'react';
import { remote } from 'electron';
import nanoid from 'nanoid';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FileSettingsIcon from 'mdi-material-ui/FileSettings';


export default function({
  className,
  label,
  helperText,
  value: passedValue = '',
  disabled = false,
  error = false,
  onChange,
  onFileSelect,
  dialog: {
    title,
    defaultPath,
    buttonLabel,
    filters,

    openFile = true,
    openDirectory = false,
    multiSelections = false,
    showHiddenFiles = false,
    createDirectory = false, // macOS
    promptToCreate = false, // Windows

    showSave = false
  },
  inputProps
}) {
  const [value, setValue] = useState('');
  const [internalId] = useState(nanoid());

  useLayoutEffect(() => {
    if(passedValue !== value) {
      setValue(passedValue);
    }

    onChange && onChange(passedValue);
  }, [passedValue]);

  function handleOpenClick() {
    const { dialog, getCurrentWindow } = remote;
    const func = showSave ? dialog.showSaveDialogSync : dialog.showOpenDialogSync;
    const properties = [];

    if(!showSave) {
      if(openFile) properties.push('openFile');
      if(openDirectory) properties.push('openDirectory');
      if(multiSelections) properties.push('multiSelections');
      if(showHiddenFiles) properties.push('showHiddenFiles');
      if(createDirectory) properties.push('createDirectory');
      if(promptToCreate) properties.push('promptToCreate');
    }

    const result = func(getCurrentWindow(), {
      title,
      defaultPath,
      buttonLabel,
      filters,
      properties
    });

    if(result !== undefined) {
      const file = Array.isArray(result) ? result[0] : result;
      setValue(file);
      onFileSelect && onFileSelect(file);
      onChange && onChange(file);
    }

  }

  function handleChange({ target: { value }}) {
    setValue(value);
    onChange && onChange(value);
  }

  let { name, id, ...restInputProps } = inputProps || {};

  !id && (id = `input-file-${internalId}`);
  !name && (name = id);

  console.log('input file render', value);

  return (
    <FormControl className={className} error={error}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Input
        {...restInputProps}
        id={id}
        name={name}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={handleOpenClick}>
              <FileSettingsIcon fontSize="small"/>
            </IconButton>
          </InputAdornment>
        }
      />
      {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
