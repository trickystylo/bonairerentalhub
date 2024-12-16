import Papa from "papaparse";

export const parseOpeningHours = (openingHours: string) => {
  try {
    if (!openingHours) return null;
    
    if (openingHours === '24/7') {
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
    
    const [start, end] = openingHours.split('-');
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
      skipEmptyLines: true,
      complete: (results) => {
        console.log("Raw CSV data:", results.data);
        const cleanData = results.data.map((row: any) => {
          // Remove any __parsed_extra fields and empty strings
          const cleanRow = Object.fromEntries(
            Object.entries(row).filter(([key, value]) => 
              key !== '__parsed_extra' && value !== ''
            )
          );
          return cleanRow;
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