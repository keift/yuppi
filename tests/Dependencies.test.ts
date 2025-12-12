import Package from '../package.json';

if (Package.dependencies['@types/node'] !== 'latest') throw new Error("❌ Error");

console.log('✅ Success');
