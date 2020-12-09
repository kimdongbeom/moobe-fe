import React from 'react';
import {ifNullEmpty} from "data/util";

export const InputField = (props) => <>
    <div className="field is-horizontal">
        <div className="field-label is-normal">
            <label className="label">{props.fieldName}</label>
        </div>
        <div className="field-body">
            <div className="field">
                <p className="control is-expanded">
                    <input className="input" name={props.name} type="text" placeholder={props.placeholder} value={ifNullEmpty(props.value)} onChange={props.onChange} disabled={props.disabled ? props.disabled : false} />
                </p>
            </div>
        </div>
    </div>
</>

export const SelectField = (props) => <>
    <div className="field is-horizontal">
        {props.fieldName
            ? <div className="field-label is-normal">
                <label className="label">{props.fieldName}</label>
            </div>
            : null}
        <div className="field-body">
            <div className="field">
                <p className="control is-expanded select is-multiple is-full-width">
                    <select multiple className="is-full-width has-text-centered" size={props.size ? props.size : 3} name={props.name} onChange={props.onChange} disabled={props.disabled ? props.disabled : false}>
                        {props.children}
                    </select>
                </p>
            </div>
        </div>
    </div>
</>