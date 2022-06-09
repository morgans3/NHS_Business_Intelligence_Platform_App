import jwt_decode from "jwt-decode";

export const generateID = () => {
    return new Date().toISOString().split("-").join().split(":").join().split(".").join().replace("T", "").replace("Z", "");
};

export const decodeToken = (token: any) => {
    return jwt_decode(token);
};

export const ucfirst = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
};

export const isNhsNumber = (nhsNumber) => {
    if(
        nhsNumber === undefined ||
        nhsNumber === null ||
        isNaN(Number(nhsNumber)) ||
        nhsNumber.toString().length !== 10
    ) {
        return false;
    }

    // convert numbers to strings, for internal consistency
    if(Number.isInteger(nhsNumber)){
        nhsNumber = nhsNumber.toString();
    }

    // Step 1: Multiply each of the first 9 numbers by (11 - position indexed from 1)
    // Step 2: Add the results together
    // Step 3: Divide the total by 11 to get the remainder
    const nhsNumberAsArray = nhsNumber.split("");
    const remainder = nhsNumberAsArray.slice(0,9)
        .map((digit, index) => {
            // multiple each digit by 11  minus its position (indexed from 1)
            return digit * (11 - (index+1));
        })
        .reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
        }, 0) % 11;

    let checkDigit = 11 - remainder;

    // replace 11 for 0
    if(checkDigit === 11){
        checkDigit = 0;
    }

    const providedCheckDigit = nhsNumberAsArray[9];

    // Do the check digits match?
    return checkDigit === Number(providedCheckDigit);
}
