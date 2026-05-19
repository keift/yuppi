import { rulint } from 'rulint';

export default rulint({
  ts: {
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['variable', 'classProperty', 'classMethod', 'objectLiteralMethod', 'function'],
          format: ['snake_case', 'PascalCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'forbid'
        }
      ]
    }
  }
});
