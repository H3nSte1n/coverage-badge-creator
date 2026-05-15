// Tiny shields.io-style badge renderer (flat, plastic, flat-square, for-the-badge, social).
// Renders as inline SVG so we can theme it and don't hit the network.
// Exposes <Badge label value color style logoText /> on window.

const BADGE_CHAR_W = 6.3; // approx px per char in Verdana 11px

function badgeTextWidth(s) {
  return Math.max(20, Math.round((s || '').length * BADGE_CHAR_W));
}

function Badge({ label = 'coverage', value = '98%', color = '#83A603', labelColor = '#555', logoText, style = 'flat', fontSize = 11, height: heightProp }) {
  const isForTheBadge = style === 'for-the-badge';
  const isPlastic = style === 'plastic';
  const isSocial = style === 'social';
  const isFlatSquare = style === 'flat-square';
  const height = heightProp || (isForTheBadge ? 28 : isPlastic ? 18 : isSocial ? 20 : 20);
  const radius = isForTheBadge || isFlatSquare || isSocial ? 0 : 3;
  const padX = isForTheBadge ? 14 : 8;
  const renderedLabel = isForTheBadge ? (label || '').toUpperCase() : (label || '');
  const renderedValue = isForTheBadge ? (value || '').toUpperCase() : (value || '');
  const labelW = label ? badgeTextWidth(renderedLabel) + padX * 2 + (logoText ? 16 : 0) : 0;
  const valueW = badgeTextWidth(renderedValue) + padX * 2;
  const totalW = labelW + valueW;
  const fs = isForTheBadge ? 10 : fontSize;

  // social style: pill split, light bg
  if (isSocial) {
    const lc = '#fafafa';
    const vc = '#eeeeee';
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={totalW} height={height} viewBox={`0 0 ${totalW} ${height}`} role="img" aria-label={`${label}: ${value}`}>
        <linearGradient id="sg" x2="0" y2="100%">
          <stop offset="0" stopColor="#fcfcfc" stopOpacity=".4" />
          <stop offset="1" stopOpacity=".15" />
        </linearGradient>
        <rect width={labelW} height={height} fill={lc} stroke="#d5d5d5" />
        <rect x={labelW} width={valueW} height={height} fill={vc} stroke="#d5d5d5" />
        <rect width={totalW} height={height} fill="url(#sg)" />
        <g fill="#333" textAnchor="middle" fontFamily="Helvetica, Verdana, Geneva, sans-serif" fontSize={fs} fontWeight="700">
          {label && <text x={labelW / 2} y={height / 2 + fs / 3}>{renderedLabel}</text>}
          <text x={labelW + valueW / 2} y={height / 2 + fs / 3}>{renderedValue}</text>
        </g>
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={totalW} height={height} viewBox={`0 0 ${totalW} ${height}`} role="img" aria-label={`${label}: ${value}`} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <defs>
        <linearGradient id="bg" x2="0" y2="100%">
          <stop offset="0" stopColor="#fff" stopOpacity=".22" />
          <stop offset="1" stopOpacity=".18" />
        </linearGradient>
        <clipPath id={`r-${radius}`}>
          <rect width={totalW} height={height} rx={radius} fill="#fff" />
        </clipPath>
      </defs>
      <g clipPath={`url(#r-${radius})`}>
        {label && <rect width={labelW} height={height} fill={labelColor} />}
        <rect x={labelW} width={valueW} height={height} fill={color} />
        {!isFlatSquare && <rect width={totalW} height={height} fill="url(#bg)" />}
      </g>
      <g fill="#fff" textAnchor="middle" fontFamily="Verdana, Geneva, DejaVu Sans, sans-serif" fontSize={fs} fontWeight={isForTheBadge ? 700 : 400} style={{ paintOrder: 'stroke' }}>
        {label && (
          <>
            <text x={labelW / 2} y={height / 2 + fs / 3 + 1} fill="#010101" fillOpacity=".3">{renderedLabel}</text>
            <text x={labelW / 2} y={height / 2 + fs / 3}>{renderedLabel}</text>
          </>
        )}
        <text x={labelW + valueW / 2} y={height / 2 + fs / 3 + 1} fill="#010101" fillOpacity=".3">{renderedValue}</text>
        <text x={labelW + valueW / 2} y={height / 2 + fs / 3}>{renderedValue}</text>
      </g>
    </svg>
  );
}

// pick a "shields-like" color for a coverage %
function coverageColor(pct) {
  if (pct >= 95) return '#4c1';        // bright green
  if (pct >= 85) return '#83A603';     // olive (brand)
  if (pct >= 75) return '#a4a61d';     // yellow-green
  if (pct >= 60) return '#dfb317';     // yellow
  if (pct >= 40) return '#fe7d37';     // orange
  return '#e05d44';                    // red
}

Object.assign(window, { Badge, coverageColor, badgeTextWidth });
