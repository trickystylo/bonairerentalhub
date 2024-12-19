import Papa from "papaparse";

const mapColumnNames = (headers: string[]) => {
  console.log("Original headers:", headers);
  
  const columnMappings: Record<string, string[]> = {
    name: ['title', 'name', 'listing_name'],
    categoryName: ['category', 'categoryname', 'category_name'],
    address: ['address', 'location', 'full_address'],
    city: ['city', 'town', 'municipality'],
    latitude: ['location/lat', 'lat', 'latitude'],
    longitude: ['location/lng', 'lng', 'longitude'],
    phone: ['phone', 'telephone', 'contact'],
    website: ['website', 'web', 'url'],
    imageUrl: ['imageurl', 'image', 'image_url', 'photo'],
    totalScore: ['totalscore', 'rating', 'score', 'total_score'],
    reviewsCount: ['reviewscount', 'reviews', 'review_count', 'total_reviews']
  };

  const headerMapping: Record<string, string> = {};
  
  headers.forEach(header => {
    const normalizedHeader = header.toLowerCase().replace(/['"]/g, '').trim();
    
    for (const [standardName, possibleNames] of Object.entries(columnMappings)) {
      if (possibleNames.includes(normalizedHeader)) {
        headerMapping[header] = standardName;
        break;
      }
    }
  });

  console.log("Mapped headers:", headerMapping);
  return headerMapping;
};

export const parseCsvFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        return header.replace(/['"]+/g, '').trim();
      },
      complete: (results) => {
        console.log("Raw CSV parsing results:", results);
        
        if (!results.data || results.data.length === 0) {
          console.error("No data found in CSV");
          reject(new Error("No data found in CSV file"));
          return;
        }

        const headerMapping = mapColumnNames(results.meta.fields || []);
        console.log("Header mapping created:", headerMapping);

        const cleanData = results.data
          .filter((row: any) => row && typeof row === 'object')
          .map((row: any) => {
            console.log("Processing row:", row);

            const getMappedValue = (standardName: string) => {
              const possibleHeaders = Object.entries(headerMapping)
                .filter(([_, mapped]) => mapped === standardName)
                .map(([original]) => original);

              for (const header of possibleHeaders) {
                if (row[header] !== undefined) {
                  return row[header];
                }
              }
              return null;
            };

            const name = getMappedValue('name');
            const categoryName = getMappedValue('categoryName');

            if (!name || !categoryName) {
              console.log("Skipping row due to missing required fields:", { name, categoryName });
              return null;
            }

            const listing = {
              name: name.trim(),
              category: categoryName.toLowerCase().replace(/\s+/g, '-'),
              display_category: categoryName,
              rating: parseFloat(getMappedValue('totalScore')) || 0,
              total_reviews: parseInt(getMappedValue('reviewsCount')) || 0,
              price_level: 2,
              languages: ["NL", "EN", "PAP", "ES"],
              phone: getMappedValue('phone') || null,
              website: getMappedValue('website') || null,
              address: getMappedValue('address') || null,
              country: 'Bonaire',
              postal_code: '',
              area: getMappedValue('city') || null,
              description: '',
              amenities: [],
              images: getMappedValue('imageUrl') ? [getMappedValue('imageUrl')] : [],
              latitude: parseFloat(getMappedValue('latitude')) || null,
              longitude: parseFloat(getMappedValue('longitude')) || null,
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
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      }
    });
  });
};