import { Patterns } from "../../src/main";

const correct_properties: string[] = ["fir4tozden", "Fir4tozden", "fir4tozden_", "fir4tozden2", "fir4tozden_2"];

const faulty_properties: string[] = ["fir4t ozden", "_fir4tozden", "1", "_"];

for (let i: number = 0; i < correct_properties.length; i++) {
  if (new RegExp(Patterns.Username).test(correct_properties[i])) {
    console.log(`✅ Success ${i + 1}/${correct_properties.length} [CORRECT_PROPERTIES]`);
  } else throw new Error(`❌ Error ${i + 1}/${correct_properties.length} [CORRECT_PROPERTIES]`);
}

for (let i: number = 0; i < faulty_properties.length; i++) {
  if (!new RegExp(Patterns.Username).test(faulty_properties[i])) {
    console.log(`✅ Success ${i + 1}/${faulty_properties.length} [FAULTY_PROPERTIES]`);
  } else throw new Error(`❌ Error ${i + 1}/${faulty_properties.length} [FAULTY_PROPERTIES]`);
}
