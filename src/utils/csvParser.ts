import Papa from "papaparse";

export const parseOpeningHours = (openingHours: string) => {
  try {
    if (!openingHours) return null;
    
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
  return category
    .replace(/^-+/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
};

export const parseCsvFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        console.log("Raw CSV data:", results.data);
        resolve(results.data);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        reject(error);
      }
    });
  });
};