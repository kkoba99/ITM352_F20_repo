
var age_count = 0;
var age = 20;
while (age_count < age) {
    if (age_count > age/2 && age_count < (3/4)*age) {
      console.log("No age zone!");
    } else {
    console.log(`age ${age_count}`);
    }
    age_count++;
}
console.log(`Kylee is ${age_count} years old`);
