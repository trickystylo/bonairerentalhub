import Papa from "papaparse";

export const parseOpeningHours = (row: any) => {
  try {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dutchToDays: { [key: string]: string } = {
      'maandag': 'monday',
      'dinsdag': 'tuesday',
      'woensdag': 'wednesday',
      'donderdag': 'thursday',
      'vrijdag': 'friday',
      'zaterdag': 'saturday',
      'zondag': 'sunday'
    };

    const hours: Record<string, { open: string; close: string }> = {};
    
    // Handle the new CSV format's opening hours
    for (let i = 0; i < 7; i++) {
      const dayKey = `openingHours/${i}/day`;
      const hoursKey = `openingHours/${i}/hours`;
      
      if (row[dayKey] && row[hoursKey]) {
        const day = dutchToDays[row[dayKey].toLowerCase()] || row[dayKey].toLowerCase();
        const [open, close] = row[hoursKey].split(' to ');
        hours[day] = { open, close };
      }
    }

    // Return the hours if we found any
    if (Object.keys(hours).length > 0) {
      return hours;
    }

    // Handle 24/7 case
    if (row.opening_hours === '24/7') {
      return days.reduce((acc, day) => ({
        ...acc,
        [day]: { open: '00:00', close: '23:59' }
      }), {});
    }

    return null;
  } catch (error) {
    console.error("Error parsing opening hours:", error);
    return null;
  }
};

export const formatCategoryName = (category: string) => {
  if (!category) return '';
  return category
    .replace(/^-+/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
};

export const parseAmenities = (amenities: string | string[] | null): string[] => {
  if (!amenities) return [];
  if (Array.isArray(amenities)) return amenities;
  return amenities.split(',').map(a => a.trim());
};

export const parseCsvFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header) => {
        return header.toLowerCase().trim();
      },
      complete: (results) => {
        console.log("Raw CSV data:", results.data);
        const cleanData = results.data
          .filter((row: any) => row && Object.keys(row).length > 0)
          .map((row: any) => {
            // Transform the new CSV format to match our database schema
            const category = (row.categoryname || 'auto').toLowerCase().replace(/\s+/g, '-');
            
            const formattedRow = {
              name: row.title || '',
              category: category,
              display_category: formatCategoryName(category),
              rating: 0,
              total_reviews: 0,
              price_level: 2,
              languages: ["NL", "EN", "PAP", "ES"],
              phone: row.phone || null,
              website: row.website || row.url || null,
              address: row.address || `${row.street}, ${row.city}`,
              country: 'Bonaire',
              postal_code: null,
              area: row.city || null,
              description: '',
              amenities: [],
              images: row.imageurl ? [row.imageurl] : [],
              latitude: parseFloat(row['location/lat']) || 0,
              longitude: parseFloat(row['location/lng']) || 0,
              opening_hours: parseOpeningHours(row),
              price_range: null,
              status: 'active'
            };

            console.log("Formatted row:", formattedRow);

            // Remove empty strings and undefined values
            return Object.fromEntries(
              Object.entries(formattedRow)
                .filter(([_, value]) => value !== '' && value !== undefined)
            );
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