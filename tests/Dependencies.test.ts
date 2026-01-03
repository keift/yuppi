import Package from '../package.json';

if (Package.devDependencies.neatlint !== 'latest') throw new Error('❌ Error: neatlint');
if (Package.devDependencies.prettier !== 'latest') throw new Error('❌ Error: prettier');
if (Package.devDependencies.tsup !== 'latest') throw new Error('❌ Error: tsup');

console.log('✅ Success');
