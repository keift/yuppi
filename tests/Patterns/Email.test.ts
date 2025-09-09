import { Patterns } from "../../src/main";

const correct_properties: string[] = ["fir4tozden@gmail.com", "fir4tozden-2@gmail.com", "fir4tozden@mail.google.com"];

const faulty_properties: string[] = ["fir4tozden gmail.com", "fir4tozden@gmail", "fir4tozden@gmail..com", "fir4tozden+2@gmail.com"];

for (let i = 0; i < correct_properties.length; i++) {
  if (new RegExp(Patterns.Email).test(correct_properties[i])) {
    console.log(`✅ Success ${(i + 1).toString()}/${correct_properties.length.toString()} [CORRECT_PROPERTIES]`);
  } else throw new Error(`❌ Error ${(i + 1).toString()}/${correct_properties.length.toString()} [CORRECT_PROPERTIES]`);
}

for (let i = 0; i < faulty_properties.length; i++) {
  if (!new RegExp(Patterns.Email).test(faulty_properties[i])) {
    console.log(`✅ Success ${(i + 1).toString()}/${faulty_properties.length.toString()} [FAULTY_PROPERTIES]`);
  } else throw new Error(`❌ Error ${(i + 1).toString()}/${faulty_properties.length.toString()} [FAULTY_PROPERTIES]`);
}
