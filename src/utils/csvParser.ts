import Papa from "papaparse";

export const formatCategoryName = (category: string) => {
  if (!category) return '';
  return category
    .replace(/^-+/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
};

export const parseCsvFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header) => {
        return header.toLowerCase().trim().replace(/[/"]/g, '');
      },
      complete: (results) => {
        console.log("Raw CSV data:", results.data);
        const cleanData = results.data
          .filter((row: any) => row && Object.keys(row).length > 0)
          .map((row: any) => {
            const category = row.categoryname?.toLowerCase().replace(/\s+/g, '-') || 'other';
            
            return {
              name: row.title || '',
              category: category,
              display_category: formatCategoryName(category),
              rating: 0,
              total_reviews: 0,
              price_level: 2,
              languages: ["NL", "EN", "PAP", "ES"],
              phone: row.phone || '',
              website: row.website || '',
              address: `${row.street || ''}, ${row.city || ''}`.trim(),
              country: 'Bonaire',
              postal_code: '',
              area: row.city || '',
              description: '',
              amenities: [],
              images: row.imageurl ? [row.imageurl] : [],
              latitude: parseFloat(row['location/lat']) || 0,
              longitude: parseFloat(row['location/lng']) || 0,
              status: 'active'
            };
          });
        resolve(cleanData);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        reject(error);
      }
    });
  });
};