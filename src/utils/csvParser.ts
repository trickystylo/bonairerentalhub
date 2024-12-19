import Papa from "papaparse";

export const parseCsvFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ',', // Explicitly set delimiter
      complete: (results) => {
        console.log("Raw CSV parsing results:", results);
        console.log("Headers found:", results.meta.fields);
        
        if (!results.data || results.data.length === 0) {
          console.error("No data found in CSV");
          resolve([]);
          return;
        }

        const cleanData = results.data
          .filter((row: any) => row && typeof row === 'object')
          .map((row: any) => {
            console.log("Raw row data:", row);
            
            // Extract all required fields with proper column names
            const {
              title,
              categoryName,
              address,
              city,
              "location/lat": latitude,
              "location/lng": longitude,
              street,
              phone,
              website,
              searchPageUrl,
              imageUrl,
              url,
              totalScore,
              reviewsCount
            } = row;

            // Log extracted values
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
              console.error("Missing required fields:", { title, categoryName });
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
              phone: phone || null,
              website: website || null,
              address: address || null,
              country: 'Bonaire',
              postal_code: '',
              area: city || null,
              description: '',
              amenities: [],
              images: imageUrl ? [imageUrl] : [],
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