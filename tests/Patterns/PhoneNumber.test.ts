import { Patterns } from "../../src/main";

const correct_properties: string[] = ["0090-5555555555"];

const faulty_properties: string[] = ["0090+5555555555", "90-5555555555", "905555555555", "5555555555"];

for (let i = 0; i < correct_properties.length; i++) {
  if (new RegExp(Patterns.PhoneNumber).test(correct_properties[i])) {
    console.log(`✅ Success ${(i + 1).toString()}/${correct_properties.length.toString()} [CORRECT_PROPERTIES]`);
  } else throw new Error(`❌ Error ${(i + 1).toString()}/${correct_properties.length.toString()} [CORRECT_PROPERTIES]`);
}

for (let i = 0; i < faulty_properties.length; i++) {
  if (!new RegExp(Patterns.PhoneNumber).test(faulty_properties[i])) {
    console.log(`✅ Success ${(i + 1).toString()}/${faulty_properties.length.toString()} [FAULTY_PROPERTIES]`);
  } else throw new Error(`❌ Error ${(i + 1).toString()}/${faulty_properties.length.toString()} [FAULTY_PROPERTIES]`);
}
