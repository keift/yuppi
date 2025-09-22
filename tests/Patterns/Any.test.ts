import { Patterns } from '../../src/main';

const correct_properties = ['Yuppi!', '', ' '];

for (let i = 0; i < correct_properties.length; i++) {
  if (new RegExp(Patterns.Any).test(correct_properties[i])) {
    console.log(`✅ Success ${(i + 1).toString()}/${correct_properties.length.toString()} [CORRECT_PROPERTIES]`);
  } else throw new Error(`❌ Error ${(i + 1).toString()}/${correct_properties.length.toString()} [CORRECT_PROPERTIES]`);
}
