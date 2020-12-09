import React from 'react';
import NumericLabel from "react-pretty-numbers";

const Numbers = props => {
    let prefix = props.prefix
    let postfix = props.postfix
    let value = +props.children
    let shortenNumber = value;
    let numberLetter = '';
    let shortenPrecision = props.shortenPrecision || 1

    if (props.shorten) {
        let sn = shortFormatter(value, props.shortFormatMinValue || 0);
        shortenNumber = Number(sn.number.toFixed(shortenPrecision)) || 0;
        numberLetter = sn.letter || '';
    }
    return (
        <span>
            {prefix}
            {props.shorten
                ? shortenNumber.toString() + numberLetter
                : (<NumericLabel>{Number(value) || 0}</NumericLabel>)}
            {postfix}
        </span>
    )
}

const shortFormatter = (num, minValue) => {
    if (!num || !+num || typeof +num !== 'number') {
        return {
            number: num
        };
    }

    var num = +num;
    var minValue = minValue || 0;
    var si = [{ value: 1E20, symbol: "해" }
        , { value: 1E16, symbol: "경" }
        , { value: 1E12, symbol: "조" }
        , { value: 1E8, symbol: "억" }
        , { value: 1E4, symbol: "만" }
        , { value: 1E3, symbol: "천" }],
        rx = /\.0+$|(\.[0-9]*[1-9])0+$/,
        i;

    if (typeof num === 'number' && num >= minValue) {
        for (i = 0; i < si.length; i++) {
            if (num >= si[i].value) {
                return {
                    number: num / si[i].value,
                    letter: si[i].symbol
                };
            }
        }
    }
    return {
        number: num
    };
};

export default Numbers;