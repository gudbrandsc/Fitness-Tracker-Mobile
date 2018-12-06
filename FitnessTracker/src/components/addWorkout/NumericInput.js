import React from "react";
import { TextInput } from "react-native";

/**
 * Component that generets a numeric input. 
 */
const NumericInput = ({
    value,
    onChangeText,
    placeholder,
    missingField,
    maxLength,

  }) => {

    return(
        <TextInput 
        placeholder = {placeholder}
        placeholderTextColor = {missingField ? "red" : "#d6d7da"}
        value={value}
        keyboardType='numeric'
        onChangeText = {onChangeText}
        style={{minWidth: 15,textAlign: 'center'}}
        maxLength={maxLength}
         />
    );
};

export {NumericInput};