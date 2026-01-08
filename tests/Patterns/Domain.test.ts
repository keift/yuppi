import { Patterns } from '../../src/main';

const correct_properties = ['google.com', 'www.google.com', 'www.www.google.com'];

const faulty_properties = ['google..com', 'www..google.com', 'www..www.google.com', 'https://google.com', 'google.com/search'];

for (let i = 0; i < correct_properties.length; i++) {
  if (new RegExp(Patterns.Domain).test(correct_properties[i])) {
    console.log(`✅ Success ${String(i + 1)}/${String(correct_properties.length)} [CORRECT_PROPERTIES]`);
  } else throw new Error(`❌ Error ${String(i + 1)}/${String(correct_properties.length)} [CORRECT_PROPERTIES]`);
}

for (let i = 0; i < faulty_properties.length; i++) {
  if (!new RegExp(Patterns.Domain).test(faulty_properties[i])) {
    console.log(`✅ Success ${String(i + 1)}/${String(faulty_properties.length)} [FAULTY_PROPERTIES]`);
  } else throw new Error(`❌ Error ${String(i + 1)}/${String(faulty_properties.length)} [FAULTY_PROPERTIES]`);
}
