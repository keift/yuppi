import { Patterns } from '../../src/main';

const correct_properties: string[] = ['https://google.com', 'https://google.com/search', 'mongodb://admin:11111111@cluster0.0000000.mongodb.net'];

const faulty_properties: string[] = ['https://google..com', 'google.com', 'google.com/search'];

for (let i = 0; i < correct_properties.length; i++) {
  if (new RegExp(Patterns.URI).test(correct_properties[i])) {
    console.log(`✅ Success ${(i + 1).toString()}/${correct_properties.length.toString()} [CORRECT_PROPERTIES]`);
  } else throw new Error(`❌ Error ${(i + 1).toString()}/${correct_properties.length.toString()} [CORRECT_PROPERTIES]`);
}

for (let i = 0; i < faulty_properties.length; i++) {
  if (!new RegExp(Patterns.URI).test(faulty_properties[i])) {
    console.log(`✅ Success ${(i + 1).toString()}/${faulty_properties.length.toString()} [FAULTY_PROPERTIES]`);
  } else throw new Error(`❌ Error ${(i + 1).toString()}/${faulty_properties.length.toString()} [FAULTY_PROPERTIES]`);
}
