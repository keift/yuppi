import Package from '../package.json';

if (Package.devDependencies.prettier !== 'latest') throw new Error('❌ Error: prettier');
if (Package.devDependencies.rulint !== 'latest') throw new Error('❌ Error: rulint');
if (Package.devDependencies.tsdown !== 'latest') throw new Error('❌ Error: tsdown');

console.log('✅ Success');
