import { CoveragePyJsonParser } from '../../src/parsers/CoveragePyJsonParser';
import fs from 'fs';

describe('CoveragePyJsonParser', () => {
  const parser = new CoveragePyJsonParser();

  it('should read percent_covered and map to lines and statements', () => {
    const fileContent = fs.readFileSync('./tests/data/test-coverage-py.json', 'utf-8');
    const result = parser.parse(fileContent);

    expect(result.total['lines'].pct).toBe(85.5);
    expect(result.total['statements'].pct).toBe(85.5);
  });

  it('should compute branch pct from num_branches and covered_branches when present', () => {
    const fileContent = fs.readFileSync('./tests/data/test-coverage-py.json', 'utf-8');
    const result = parser.parse(fileContent);

    // covered_branches=16, num_branches=20 → 80%
    expect(result.total['branches'].pct).toBeCloseTo(80, 1);
  });

  it('should fall back to lines.pct for branches when num_branches is absent', () => {
    const content = JSON.stringify({ totals: { percent_covered: 75.0 } });
    const result = parser.parse(content);

    expect(result.total['branches'].pct).toBe(75.0);
  });

  it('should set functions.pct equal to lines.pct', () => {
    const fileContent = fs.readFileSync('./tests/data/test-coverage-py.json', 'utf-8');
    const result = parser.parse(fileContent);

    expect(result.total['functions'].pct).toEqual(result.total['lines'].pct);
  });

  it('should produce all four required keys in total', () => {
    const fileContent = fs.readFileSync('./tests/data/test-coverage-py.json', 'utf-8');
    const result = parser.parse(fileContent);

    expect(result.total).toHaveProperty('lines');
    expect(result.total).toHaveProperty('statements');
    expect(result.total).toHaveProperty('branches');
    expect(result.total).toHaveProperty('functions');
  });

  it('should throw on invalid JSON', () => {
    expect(() => parser.parse('not-json')).toThrow();
  });
});
