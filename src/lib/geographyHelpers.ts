/**
 * Geography Helper Utilities
 * 
 * Functions for extracting, normalizing, and mapping council names and geographic regions
 * for SEO and content clustering purposes.
 */

// Common UK regions and their constituent counties/areas
export const UK_REGIONS: Record<string, string[]> = {
  'South East': [
    'Surrey', 'Kent', 'East Sussex', 'West Sussex', 'Hampshire', 'Isle of Wight',
    'Berkshire', 'Oxfordshire', 'Buckinghamshire', 'Milton Keynes'
  ],
  'East': [
    'Cambridgeshire', 'Peterborough', 'Essex', 'Hertfordshire', 'Norfolk', 'Suffolk',
    'Bedfordshire', 'Luton', 'Southend-on-Sea', 'Thurrock'
  ],
  'North West': [
    'Lancashire', 'Greater Manchester', 'Merseyside', 'Cheshire', 'Cumbria',
    'Blackpool', 'Blackburn with Darwen', 'Warrington', 'Halton'
  ],
  'South West': [
    'Devon', 'Cornwall', 'Somerset', 'Dorset', 'Gloucestershire', 'Wiltshire',
    'Bath and North East Somerset', 'Bournemouth', 'Bristol', 'Plymouth', 'Swindon'
  ],
  'East Midlands': [
    'Derbyshire', 'Leicestershire', 'Lincolnshire', 'Northamptonshire', 'Nottinghamshire',
    'Rutland', 'Derby', 'Leicester', 'Nottingham'
  ],
  'West Midlands': [
    'Staffordshire', 'Warwickshire', 'Worcestershire', 'Shropshire', 'Herefordshire',
    'Birmingham', 'Coventry', 'Dudley', 'Sandwell', 'Solihull', 'Walsall', 'Wolverhampton',
    'Stoke-on-Trent', 'Telford and Wrekin'
  ],
  'Yorkshire and the Humber': [
    'North Yorkshire', 'South Yorkshire', 'West Yorkshire', 'East Riding of Yorkshire',
    'York', 'Kingston upon Hull', 'Sheffield', 'Leeds', 'Bradford', 'Wakefield'
  ],
  'North East': [
    'County Durham', 'Northumberland', 'Tyne and Wear', 'Tees Valley',
    'Newcastle upon Tyne', 'Sunderland', 'Middlesbrough', 'Hartlepool', 'Stockton-on-Tees'
  ],
  'London': [
    'City of London', 'Westminster', 'Kensington and Chelsea', 'Hammersmith and Fulham',
    'Wandsworth', 'Lambeth', 'Southwark', 'Tower Hamlets', 'Hackney', 'Islington',
    'Camden', 'Brent', 'Ealing', 'Hounslow', 'Richmond upon Thames', 'Kingston upon Thames',
    'Merton', 'Sutton', 'Croydon', 'Bromley', 'Lewisham', 'Greenwich', 'Bexley',
    'Havering', 'Barking and Dagenham', 'Redbridge', 'Newham', 'Waltham Forest',
    'Haringey', 'Enfield', 'Barnet', 'Harrow', 'Hillingdon'
  ]
};

// Common council name variations and their normalized forms
export const COUNCIL_NAME_VARIANTS: Record<string, string> = {
  // Surrey councils
  'elmbridge': 'Elmbridge',
  'epsom and ewell': 'Epsom and Ewell',
  'epsom & ewell': 'Epsom and Ewell',
  'guildford': 'Guildford',
  'mole valley': 'Mole Valley',
  'reigate and banstead': 'Reigate and Banstead',
  'reigate & banstead': 'Reigate and Banstead',
  'runnymede': 'Runnymede',
  'spelthorne': 'Spelthorne',
  'surrey heath': 'Surrey Heath',
  'tandridge': 'Tandridge',
  'waverley': 'Waverley',
  'woking': 'Woking',
  
  // Common variations
  'north yorkshire': 'North Yorkshire',
  'south yorkshire': 'South Yorkshire',
  'west yorkshire': 'West Yorkshire',
  'east riding': 'East Riding of Yorkshire',
  'east riding of yorkshire': 'East Riding of Yorkshire',
  
  // Combined authorities
  'greater manchester': 'Greater Manchester',
  'west midlands': 'West Midlands',
  'tees valley': 'Tees Valley',
  'liverpool city region': 'Liverpool City Region',
  'west of england': 'West of England',
  'cambridgeshire and peterborough': 'Cambridgeshire and Peterborough',
  'cambridgeshire & peterborough': 'Cambridgeshire and Peterborough',
};

/**
 * Normalize a council or region name to a standard form
 */
export function normalizeGeographyName(name: string): string {
  if (!name) return '';
  
  const normalized = name.trim();
  const lowerName = normalized.toLowerCase();
  
  // Check for exact match in variants
  if (COUNCIL_NAME_VARIANTS[lowerName]) {
    return COUNCIL_NAME_VARIANTS[lowerName];
  }
  
  // Remove common suffixes and normalize
  let cleaned = normalized
    .replace(/\s+and\s+/gi, ' & ')
    .replace(/\s+&\s+/gi, ' & ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Capitalize first letter of each word
  return cleaned
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Extract council names from text content
 * Returns an array of potential council/region names found in the text
 */
export function extractCouncilNames(text: string): string[] {
  if (!text) return [];
  
  const found: Set<string> = new Set();
  const lowerText = text.toLowerCase();
  
  // Check for known council names
  for (const [variant, normalized] of Object.entries(COUNCIL_NAME_VARIANTS)) {
    if (lowerText.includes(variant)) {
      found.add(normalized);
    }
  }
  
  // Check for region names
  for (const region of Object.keys(UK_REGIONS)) {
    if (lowerText.includes(region.toLowerCase())) {
      found.add(region);
    }
    
    // Check for counties in regions
    for (const county of UK_REGIONS[region]) {
      if (lowerText.includes(county.toLowerCase())) {
        found.add(county);
      }
    }
  }
  
  // Pattern matching for common council name formats
  const councilPatterns = [
    /\b([A-Z][a-z]+(?:\s+(?:and|&)\s+[A-Z][a-z]+)?)\s+(?:Borough|District|City|County|Council)\b/gi,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Unitary|Authority)\b/gi,
  ];
  
  for (const pattern of councilPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const name = match.replace(/\s+(?:Borough|District|City|County|Council|Unitary|Authority)\b/gi, '').trim();
        if (name.length > 2) {
          found.add(normalizeGeographyName(name));
        }
      });
    }
  }
  
  return Array.from(found);
}

/**
 * Get the region for a given council or county name
 */
export function getRegionForGeography(geography: string): string | null {
  if (!geography) return null;
  
  const normalized = normalizeGeographyName(geography);
  const lowerName = normalized.toLowerCase();
  
  // Check each region
  for (const [region, counties] of Object.entries(UK_REGIONS)) {
    if (lowerName === region.toLowerCase()) {
      return region;
    }
    
    for (const county of counties) {
      if (lowerName === county.toLowerCase()) {
        return region;
      }
    }
  }
  
  return null;
}

/**
 * Get the country for a given geography
 * For now, assumes all geographies are in England unless specified
 */
export function getCountryForGeography(geography: string): string {
  if (!geography) return 'England';
  
  const lowerName = geography.toLowerCase();
  
  // Check for Scotland, Wales, Northern Ireland indicators
  if (lowerName.includes('scotland') || lowerName.includes('scottish')) {
    return 'Scotland';
  }
  if (lowerName.includes('wales') || lowerName.includes('welsh')) {
    return 'Wales';
  }
  if (lowerName.includes('northern ireland') || lowerName.includes('northern irish')) {
    return 'Northern Ireland';
  }
  
  return 'England';
}

/**
 * Check if a geography name is a known council or region
 */
export function isValidGeography(geography: string): boolean {
  if (!geography) return false;
  
  const normalized = normalizeGeographyName(geography);
  const lowerName = normalized.toLowerCase();
  
  // Check variants
  if (COUNCIL_NAME_VARIANTS[lowerName]) {
    return true;
  }
  
  // Check regions
  if (UK_REGIONS[normalized]) {
    return true;
  }
  
  // Check counties in regions
  for (const counties of Object.values(UK_REGIONS)) {
    if (counties.some(c => c.toLowerCase() === lowerName)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Format geography for display in titles/meta descriptions
 * Returns a formatted string suitable for SEO
 */
export function formatGeographyForSEO(geography: string | null, region?: string | null): string {
  if (!geography) return '';
  
  const normalized = normalizeGeographyName(geography);
  
  // If it's a region name, return as-is
  if (UK_REGIONS[normalized]) {
    return normalized;
  }
  
  // If region is provided and different, format as "Geography, Region"
  if (region && region !== normalized) {
    const regionName = normalizeGeographyName(region);
    if (regionName !== normalized) {
      return `${normalized}, ${regionName}`;
    }
  }
  
  return normalized;
}
