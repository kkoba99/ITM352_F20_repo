
function isNonNegIntString (string_to_check, returnErrors=false) {
        /*This fucntion return true if string_to_check is a non negative integer.
        If returnerror is true it will reutnr the array of reasons it is not a non-negative integer*/
        errors = []; // assume no errors at first
        if(Number(string_to_check) != string_to_check) errors.push('Not a number!'); // Check if string is a number value
        if(string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
        if(parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer
        
       return returnErrors ? errors : (errors.length == 0);
}

age = 20
name = "Kylee"
attributes  =  name + ";" + age + ";" + (age + 0.5)+ ";" + (0.5 - age);
pieces = attributes.split(';');

for (i in pieces) {
        console.log(`${pieces[i]} is non neg pieces ${isNonNegIntString(pieces[i], true).join('**')}`);
}

    