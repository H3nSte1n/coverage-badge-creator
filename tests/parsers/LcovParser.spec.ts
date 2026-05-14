import { LcovParser } from '../../src/parsers/LcovParser';
import fs from 'fs';

describe('LcovParser', () => {
  const parser = new LcovParser();

  it('should aggregate LF/LH/BRF/BRH/FNF/FNH across all sections', () => {
    const fileContent = fs.readFileSync('./tests/data/test-coverage.info', 'utf-8');
    const result = parser.parse(fileContent);

    // LF=50+30=80, LH=45+28=73 → 73/80*100 = 91.25
    expect(result.total['lines'].pct).toBeCloseTo(91.25, 2);
    // BRF=10+6=16, BRH=8+5=13 → 13/16*100 = 81.25
    expect(result.total['branches'].pct).toBeCloseTo(81.25, 2);
    // FNF=5+3=8, FNH=4+3=7 → 7/8*100 = 87.5
    expect(result.total['functions'].pct).toBeCloseTo(87.5, 2);
  });

  it('should set statements.pct equal to lines.pct', () => {
    const fileContent = fs.readFileSync('./tests/data/test-coverage.info', 'utf-8');
    const result = parser.parse(fileContent);

    expect(result.total['statements'].pct).toEqual(result.total['lines'].pct);
  });

  it('should return 0 for all categories when all counts are zero', () => {
    const result = parser.parse('TN:\nSF:empty.ts\nLF:0\nLH:0\nBRF:0\nBRH:0\nFNF:0\nFNH:0\nend_of_record\n');

    expect(result.total['lines'].pct).toBe(0);
    expect(result.total['branches'].pct).toBe(0);
    expect(result.total['functions'].pct).toBe(0);
  });

  it('should return 0 when no lcov counters are present', () => {
    const result = parser.parse('TN:\nSF:src/file.ts\nend_of_record\n');

    expect(result.total['lines'].pct).toBe(0);
    expect(result.total['branches'].pct).toBe(0);
    expect(result.total['functions'].pct).toBe(0);
  });

  it('should produce all four required keys in total', () => {
    const fileContent = fs.readFileSync('./tests/data/test-coverage.info', 'utf-8');
    const result = parser.parse(fileContent);

    expect(result.total).toHaveProperty('lines');
    expect(result.total).toHaveProperty('statements');
    expect(result.total).toHaveProperty('branches');
    expect(result.total).toHaveProperty('functions');
  });
});
