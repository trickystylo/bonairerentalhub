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
        // Remove quotes and trim whitespace
        return header.replace(/['"]+/g, '').trim();
      },
      complete: (results) => {
        console.log("Raw CSV parsing results:", results);
        console.log("Headers found:", results.meta.fields);
        
        if (!results.data || results.data.length === 0) {
          console.error("No data found in CSV");
          resolve([]);
          return;
        }

        // Extract unique categories first
        const categories = new Set<string>();
        results.data.forEach((row: any) => {
          if (row.categoryName) {
            categories.add(row.categoryName);
          }
        });

        console.log("Found categories:", categories);

        const cleanData = results.data
          .filter((row: any) => row && typeof row === 'object')
          .map((row: any) => {
            console.log("Raw row data:", row);
            
            // Extract values and log them for debugging
            const title = row.title;
            const categoryName = row.categoryName;
            const latitude = row['location/lat'];
            const longitude = row['location/lng'];
            const totalScore = row.totalScore;
            const reviewsCount = row.reviewsCount;

            console.log("Extracted values:", {
              title,
              categoryName,
              latitude,
              longitude,
              totalScore,
              reviewsCount
            });

            // Validate required fields
            if (!title || !categoryName) {
              console.error("Missing required fields:", {
                title: { _type: typeof title, value: title },
                categoryName: { _type: typeof categoryName, value: categoryName }
              });
              return null;
            }

            // Create listing object with all fields mapped to database columns
            const listing = {
              name: title.trim(),
              category: categoryName.toLowerCase().replace(/\s+/g, '-'),
              display_category: categoryName,
              rating: parseFloat(totalScore) || 0,
              total_reviews: parseInt(reviewsCount) || 0,
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
              latitude: parseFloat(latitude) || null,
              longitude: parseFloat(longitude) || null,
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