import Papa from "papaparse";

export const parseOpeningHours = (data: any) => {
  try {
    // Handle the new CSV format's opening hours
    if (data['openingHours/0/day']) {
      const hours: Record<string, { open: string; close: string }> = {};
      for (let i = 0; i < 7; i++) {
        const day = data[`openingHours/${i}/day`]?.toLowerCase();
        const hoursRange = data[`openingHours/${i}/hours`];
        if (day && hoursRange) {
          const [open, close] = hoursRange.split(' to ');
          hours[day] = { open, close };
        }
      }
      return hours;
    }

    // Handle the existing format
    if (!data.opening_hours && !data.openingHours) return null;
    
    const hours = data.opening_hours || data.openingHours;
    if (hours === '24/7') {
      return {
        monday: { open: '00:00', close: '23:59' },
        tuesday: { open: '00:00', close: '23:59' },
        wednesday: { open: '00:00', close: '23:59' },
        thursday: { open: '00:00', close: '23:59' },
        friday: { open: '00:00', close: '23:59' },
        saturday: { open: '00:00', close: '23:59' },
        sunday: { open: '00:00', close: '23:59' }
      };
    }
    
    const [start, end] = hours.split('-');
    return {
      monday: { open: start, close: end },
      tuesday: { open: start, close: end },
      wednesday: { open: start, close: end },
      thursday: { open: start, close: end },
      friday: { open: start, close: end },
      saturday: { open: start, close: end },
      sunday: { open: start, close: end }
    };
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
            const formattedRow = {
              name: row.title || row.name,
              category: (row.categoryname || row.category || 'auto').toLowerCase().replace(/\s+/g, '-'),
              display_category: row.categoryname || row.category || 'Auto',
              rating: parseFloat(row.rating) || 0,
              total_reviews: parseInt(row.total_reviews) || 0,
              price_level: parseInt(row.price_level) || 2,
              languages: row.languages ? row.languages.split(',').map((l: string) => l.trim()) : ["NL", "EN", "PAP", "ES"],
              phone: row.phone,
              website: row.website || row.url,
              address: row.address || `${row.street}, ${row.city}`,
              country: row.country || 'Bonaire',
              postal_code: row.postal_code,
              area: row.city,
              description: row.description || '',
              amenities: parseAmenities(row.amenities),
              images: row.imageurl ? [row.imageurl] : (row.images ? [row.images] : []),
              latitude: parseFloat(row['location/lat'] || row.latitude) || 0,
              longitude: parseFloat(row['location/lng'] || row.longitude) || 0,
              opening_hours: parseOpeningHours(row),
              price_range: row.price_range,
              status: 'active'
            };

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