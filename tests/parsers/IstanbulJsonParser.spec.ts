import { IstanbulJsonParser } from '../../src/parsers/IstanbulJsonParser';
import fs from 'fs';

describe('IstanbulJsonParser', () => {
  const parser = new IstanbulJsonParser();

  it('should parse a valid coverage-summary.json and return CoverageInterface shape', () => {
    const fileContent = fs.readFileSync('./tests/data/test-coverage-report.json', 'utf-8');
    const result = parser.parse(fileContent);

    expect(result).toHaveProperty('total');
    expect(result.total).toHaveProperty('lines');
    expect(result.total).toHaveProperty('statements');
    expect(result.total).toHaveProperty('branches');
    expect(result.total).toHaveProperty('functions');
  });

  it('should preserve pct values from the JSON', () => {
    const fileContent = fs.readFileSync('./tests/data/test-coverage-report.json', 'utf-8');
    const result = parser.parse(fileContent);

    expect(typeof result.total['lines'].pct).toBe('number');
    expect(typeof result.total['statements'].pct).toBe('number');
  });

  it('should throw on invalid JSON', () => {
    expect(() => parser.parse('not-valid-json')).toThrow();
  });
});
