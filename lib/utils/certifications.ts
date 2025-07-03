const CERTIFICATION_MAP: { [key: string]: { region: string; ratings: { [key: string]: string } } } = {
  Hollywood: {
    region: 'US',
    ratings: {
      'G': 'G',
      'PG': 'PG',
      'PG-13': 'PG-13',
      'R': 'R',
      'NC-17': 'NC-17'
    }
  },
  Bollywood: {
    region: 'IN',
    ratings: {
      'U': 'U',
      'UA': 'UA',
      'A': 'A',
      'S': 'S'
    }
  },
  Korean: {
    region: 'KR',
    ratings: {
      'All': 'All',
      '12': '12',
      '15': '15',
      '18': '18'
    }
  },
  Japanese: {
    region: 'JP',
    ratings: {
      'G': 'G',
      'PG12': 'PG12',
      'R15+': 'R15+',
      'R18+': 'R18+'
    }
  }
};

export function getCertificationQuery(industry: string, contentRating: string): string {
  const certification = CERTIFICATION_MAP[industry];
  if (!certification) return '';

  return `&certification_country=${certification.region}&certification=${certification.ratings[contentRating] || ''}`;
}