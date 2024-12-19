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
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Remove any quotes and trim whitespace
        return header.replace(/['"]+/g, '').trim();
      },
      complete: (results) => {
        console.log("Raw CSV parsing results:", results);
        
        if (!results.data || results.data.length === 0) {
          console.error("No data found in CSV");
          resolve([]);
          return;
        }

        const cleanData = results.data
          .filter((row: any) => row && typeof row === 'object')
          .map((row: any) => {
            console.log("Processing row:", row);

            // Validate required fields
            if (!row.title || !row.categoryName) {
              console.error("Missing required fields:", { title: row.title, categoryName: row.categoryName });
              return null;
            }

            // Create listing object with all fields mapped to database columns
            const listing = {
              name: row.title.trim(),
              category: row.categoryName.toLowerCase().replace(/\s+/g, '-'),
              display_category: row.categoryName,
              rating: parseFloat(row.totalScore) || 0,
              total_reviews: parseInt(row.reviewsCount) || 0,
              price_level: 2,
              languages: ["NL", "EN", "PAP", "ES"],
              phone: row.phone || null,
              website: row.website || null,
              address: row.address || null,
              country: 'Bonaire',
              postal_code: '',
              area: row.city || null,
              description: '',
              amenities: [],
              images: row.imageUrl ? [row.imageUrl] : [],
              latitude: parseFloat(row.location_lat) || null,
              longitude: parseFloat(row.location_lng) || null,
              status: 'active'
            };

            console.log("Created listing object:", listing);
            return listing;
          })
          .filter(item => item !== null);

        console.log("Final cleaned data:", cleanData);
        resolve(cleanData);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        reject(error);
      }
    });
  });
};