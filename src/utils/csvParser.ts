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
      delimiter: ',',
      skipEmptyLines: 'greedy',
      transformHeader: (header) => {
        // Clean up header names and map them to our expected format
        const headerMap: { [key: string]: string } = {
          'title': 'name',
          'categoryName': 'categoryname',
          'location/lat': 'locationlat',
          'location/lng': 'locationlng',
          'searchPageUrl': 'searchpageurl',
          'imageUrl': 'imageurl',
          'totalScore': 'totalscore',
          'reviewsCount': 'reviewscount'
        };
        
        // Remove quotes and clean the header
        const cleanHeader = header.replace(/['"]/g, '').trim().toLowerCase();
        console.log("Cleaned header:", cleanHeader);
        return headerMap[cleanHeader] || cleanHeader;
      },
      complete: async (results) => {
        console.log("Raw CSV parsing results:", results);
        
        if (!results.data || results.data.length === 0) {
          console.error("No data found in CSV");
          resolve([]);
          return;
        }
        
        // Map the data to our expected format
        const cleanData = results.data
          .filter((row: any) => row && typeof row === 'object')
          .map((row: any) => {
            console.log("Processing row:", row);
            
            // Extract name from title
            const name = row.name || '';
            if (!name) {
              console.error("Row missing name:", row);
              return null;
            }

            // Extract and clean category
            const categoryName = row.categoryname || 'Other';
            const category = categoryName.toLowerCase().replace(/\s+/g, '-');
            
            return {
              name: name.trim(),
              category: category,
              display_category: categoryName,
              rating: parseFloat(row.totalscore) || 0,
              total_reviews: parseInt(row.reviewscount) || 0,
              price_level: parseInt(row.price_level) || 2,
              languages: ["NL", "EN", "PAP", "ES"],
              phone: row.phone || null,
              website: row.website || null,
              address: row.address || null,
              country: 'Bonaire',
              postal_code: '',
              area: row.city || null,
              description: row.description || '',
              amenities: [],
              images: row.imageurl ? [row.imageurl] : [],
              latitude: parseFloat(row.locationlat) || null,
              longitude: parseFloat(row.locationlng) || null,
              status: 'active'
            };
          })
          .filter(item => item !== null);

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