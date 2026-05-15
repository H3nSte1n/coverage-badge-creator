import { CoberturaParser } from '../../src/parsers/CoberturaParser';
import fs from 'fs';

describe('CoberturaParser', () => {
  const parser = new CoberturaParser();

  it('should extract line-rate and branch-rate from root <coverage> element', () => {
    const fileContent = fs.readFileSync('./tests/data/test-coverage.xml', 'utf-8');
    const result = parser.parse(fileContent);

    expect(result.total['lines'].pct).toBeCloseTo(91, 0);
    expect(result.total['branches'].pct).toBeCloseTo(84, 0);
  });

  it('should set statements.pct and functions.pct equal to lines.pct', () => {
    const fileContent = fs.readFileSync('./tests/data/test-coverage.xml', 'utf-8');
    const result = parser.parse(fileContent);

    expect(result.total['statements'].pct).toEqual(result.total['lines'].pct);
    expect(result.total['functions'].pct).toEqual(result.total['lines'].pct);
  });

  it('should return 0 for missing attributes', () => {
    const result = parser.parse('<coverage></coverage>');

    expect(result.total['lines'].pct).toBe(0);
    expect(result.total['branches'].pct).toBe(0);
  });

  it('should not be confused by line-rate attributes on child <class> elements', () => {
    const xml = `<?xml version="1.0" ?>
<coverage line-rate="0.91" branch-rate="0.84">
  <packages>
    <package>
      <classes>
        <class line-rate="0.5" branch-rate="0.3"></class>
      </classes>
    </package>
  </packages>
</coverage>`;
    const result = parser.parse(xml);

    expect(result.total['lines'].pct).toBeCloseTo(91, 0);
    expect(result.total['branches'].pct).toBeCloseTo(84, 0);
  });

  it('should produce all four required keys in total', () => {
    const fileContent = fs.readFileSync('./tests/data/test-coverage.xml', 'utf-8');
    const result = parser.parse(fileContent);

    expect(result.total).toHaveProperty('lines');
    expect(result.total).toHaveProperty('statements');
    expect(result.total).toHaveProperty('branches');
    expect(result.total).toHaveProperty('functions');
  });
});
