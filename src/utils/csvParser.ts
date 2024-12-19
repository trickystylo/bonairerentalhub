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
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Remove quotes and clean the header
        const cleanHeader = header.replace(/['"]/g, '').trim();
        console.log("Original header:", header, "Cleaned header:", cleanHeader);
        
        // Map headers to our database column names
        const headerMap: { [key: string]: string } = {
          'title': 'name',
          'categoryName': 'category',
          'totalScore': 'rating',
          'reviewsCount': 'total_reviews',
          'location/lat': 'latitude',
          'location/lng': 'longitude',
          'imageUrl': 'images'
        };
        
        return headerMap[cleanHeader] || cleanHeader.toLowerCase();
      },
      complete: (results) => {
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
            
            // Get the name from the title field
            const name = row.name;
            if (!name) {
              console.error("Row missing name:", row);
              return null;
            }

            // Get and clean category
            const categoryName = row.category || 'Other';
            const category = categoryName.toLowerCase().replace(/\s+/g, '-');
            
            // Create listing object with all required fields
            const listing = {
              name: name.trim(),
              category: category,
              display_category: categoryName,
              rating: parseFloat(row.rating) || 0,
              total_reviews: parseInt(row.total_reviews) || 0,
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
              images: row.images ? [row.images] : [],
              latitude: parseFloat(row.latitude) || null,
              longitude: parseFloat(row.longitude) || null,
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