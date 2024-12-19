import Papa from "papaparse";

export const formatCategoryName = (name: string): string => {
  if (!name) return '';
  return name.trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const validateRequiredColumns = (headers: string[]): string | null => {
  const requiredColumns = ['title', 'name', 'categoryname', 'category'];
  const hasNameColumn = headers.some(header => 
    ['title', 'name'].includes(header.toLowerCase().trim()));
  const hasCategoryColumn = headers.some(header => 
    ['categoryname', 'category'].includes(header.toLowerCase().trim()));

  if (!hasNameColumn) {
    return "Missing required column: 'title' or 'name'. Please add one of these columns to your CSV.";
  }
  if (!hasCategoryColumn) {
    return "Missing required column: 'categoryName' or 'category'. Please add one of these columns to your CSV.";
  }
  return null;
};

const mapColumnNames = (headers: string[]) => {
  console.log("Processing CSV headers:", headers);
  
  const columnMappings: Record<string, string[]> = {
    name: ['title', 'name', 'listing_name'],
    categoryName: ['category', 'categoryname', 'category_name'],
    address: ['address', 'location', 'full_address', 'street'],
    city: ['city', 'town', 'municipality'],
    latitude: ['location/lat', 'lat', 'latitude'],
    longitude: ['location/lng', 'lng', 'longitude'],
    phone: ['phone', 'telephone', 'contact'],
    website: ['website', 'web', 'url'],
    imageUrl: ['imageurl', 'image', 'image_url', 'photo', 'searchpageurl'],
    totalScore: ['totalscore', 'rating', 'score', 'total_score'],
    reviewsCount: ['reviewscount', 'reviews', 'review_count', 'total_reviews']
  };

  const headerMapping: Record<string, string> = {};
  const unmappedColumns: string[] = [];
  
  headers.forEach(header => {
    const normalizedHeader = header.toLowerCase().replace(/['"]/g, '').trim();
    let mapped = false;
    
    for (const [standardName, possibleNames] of Object.entries(columnMappings)) {
      if (possibleNames.includes(normalizedHeader)) {
        headerMapping[header] = standardName;
        mapped = true;
        break;
      }
    }
    
    if (!mapped) {
      unmappedColumns.push(header);
    }
  });

  console.log("Mapped headers:", headerMapping);
  if (unmappedColumns.length > 0) {
    console.log("Unmapped columns (will be ignored):", unmappedColumns);
  }
  
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
        console.log("Starting CSV parsing...");
        
        if (!results.data || results.data.length === 0) {
          reject(new Error("The CSV file is empty. Please make sure it contains data."));
          return;
        }

        const headers = results.meta.fields || [];
        console.log("CSV headers found:", headers);

        const validationError = validateRequiredColumns(headers);
        if (validationError) {
          reject(new Error(validationError));
          return;
        }

        const headerMapping = mapColumnNames(headers);

        const cleanData = results.data
          .filter((row: any) => row && typeof row === 'object')
          .map((row: any, index: number) => {
            console.log(`Processing row ${index + 1}:`, row);

            const getMappedValue = (standardName: string) => {
              const possibleHeaders = Object.entries(headerMapping)
                .filter(([_, mapped]) => mapped === standardName)
                .map(([original]) => original);

              for (const header of possibleHeaders) {
                if (row[header] !== undefined && row[header] !== '') {
                  return row[header];
                }
              }
              return null;
            };

            const name = getMappedValue('name');
            const categoryName = getMappedValue('categoryName');

            if (!name || !categoryName) {
              console.warn(`Skipping row ${index + 1} due to missing required fields:`, 
                { name, categoryName });
              return null;
            }

            const listing = {
              name: name.trim(),
              category: categoryName.toLowerCase().replace(/\s+/g, '-'),
              display_category: formatCategoryName(categoryName),
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

            console.log(`Successfully processed row ${index + 1}:`, listing);
            return listing;
          })
          .filter(item => item !== null);

        if (cleanData.length === 0) {
          reject(new Error("No valid data could be extracted from the CSV. Please check that your rows contain at least a name/title and category/categoryName."));
          return;
        }

        console.log(`Successfully processed ${cleanData.length} listings`);
        resolve(cleanData);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        reject(new Error(`Failed to parse CSV: ${error.message}. Please ensure your file is a valid CSV format.`));
      }
    });
  });
};