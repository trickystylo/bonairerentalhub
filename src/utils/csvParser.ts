import Papa from "papaparse";

export const formatCategoryName = (category: string) => {
  if (!category) return '';
  return category
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
      complete: async (results) => {
        console.log("Raw CSV data:", results.data);
        const cleanData = results.data
          .filter((row: any) => row && Object.keys(row).length > 0 && row.title)
          .map((row: any) => {
            // Convert categoryName to proper format for storage
            const category = row.categoryname?.toLowerCase().replace(/\s+/g, '-') || 'other';
            const displayCategory = row.categoryname || formatCategoryName(category);
            
            return {
              name: row.title.trim(),
              category: category,
              display_category: displayCategory,
              rating: parseFloat(row.totalscore) || 0,
              total_reviews: parseInt(row.reviewscount) || 0,
              price_level: 2,
              languages: ["NL", "EN", "PAP", "ES"],
              phone: row.phone || '',
              website: row.website || '',
              address: row.address || '',
              country: 'Bonaire',
              postal_code: '',
              area: row.city || '',
              description: '',
              amenities: [],
              images: row.imageurl ? [row.imageurl] : [],
              latitude: parseFloat(row['location/lat']) || null,
              longitude: parseFloat(row['location/lng']) || null,
              status: 'active'
            };
          });
        console.log("Cleaned data:", cleanData);
        resolve(cleanData);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        reject(error);
      }
    });
  });
};