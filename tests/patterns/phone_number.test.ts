import { Patterns } from '../../src/main';

const correct_properties = ['0090-5555555555'];

const faulty_properties = ['0090+5555555555', '90-5555555555', '905555555555', '5555555555'];

for (let i = 0; i < correct_properties.length; i++) {
  if (new RegExp(Patterns.PhoneNumber).test(correct_properties[i])) {
    console.log(`✅ Success ${String(i + 1)}/${String(correct_properties.length)} [CORRECT_PROPERTIES]`);
  } else throw new Error(`❌ Error ${String(i + 1)}/${String(correct_properties.length)} [CORRECT_PROPERTIES]`);
}

for (let i = 0; i < faulty_properties.length; i++) {
  if (!new RegExp(Patterns.PhoneNumber).test(faulty_properties[i])) {
    console.log(`✅ Success ${String(i + 1)}/${String(faulty_properties.length)} [FAULTY_PROPERTIES]`);
  } else throw new Error(`❌ Error ${String(i + 1)}/${String(faulty_properties.length)} [FAULTY_PROPERTIES]`);
}
