import { Patterns } from "../../src/main";

const correct_properties: string[] = ["https://google.com", "https://google.com/search"];

const faulty_properties: string[] = ["https://google..com", "google.com", "google.com/search", "mongodb://admin:11111111@cluster0.0000000.mongodb.net"];

for (let i: number = 0; i < correct_properties.length; i++) {
  if (new RegExp(Patterns.HTTP).test(correct_properties[i])) {
    console.log(`✅ Success ${i + 1}/${correct_properties.length} [CORRECT_PROPERTIES]`);
  } else throw new Error(`❌ Error ${i + 1}/${correct_properties.length} [CORRECT_PROPERTIES]`);
}

for (let i: number = 0; i < faulty_properties.length; i++) {
  if (!new RegExp(Patterns.HTTP).test(faulty_properties[i])) {
    console.log(`✅ Success ${i + 1}/${faulty_properties.length} [FAULTY_PROPERTIES]`);
  } else throw new Error(`❌ Error ${i + 1}/${faulty_properties.length} [FAULTY_PROPERTIES]`);
}
