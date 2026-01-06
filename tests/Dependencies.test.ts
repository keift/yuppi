import Package from '../package.json';

if (Package.devDependencies.prettier !== 'latest') throw new Error('❌ Error: prettier');
if (Package.devDependencies.rulint !== 'latest') throw new Error('❌ Error: rulint');
if (Package.devDependencies.tsup !== 'latest') throw new Error('❌ Error: tsup');

console.log('✅ Success');
