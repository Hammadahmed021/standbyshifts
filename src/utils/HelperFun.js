import { fallback } from "../assets";

export const transformData = (apiResponse) => {
  if (!apiResponse || !Array.isArray(apiResponse)) return [];
  return apiResponse.map((item) => ({
    id: item?.id,
    title: item?.name,
    location: item?.address || "N/A",
    images:
      item?.galleries && item.galleries.length > 0
        ? item.galleries.map((gallery) => gallery?.image)
        : [fallback],
    rating:
      item?.ratings_of_hotel && item.ratings_of_hotel.length > 0
        ? item.ratings_of_hotel.reduce((acc, rate) => {
            const totalRating = parseFloat(rate.total_rating) || 0;
            const count = rate.count || 1; // Avoid division by zero
            return acc + totalRating / count;
          }, 0) / item.ratings_of_hotel.length // Average across all hotels
        : "N/A",

    cuisine:
      item?.kitchens && item.kitchens.length > 0
        ? item.kitchens.map((kitchen) => kitchen?.name).join(", ")
        : "N/A",
    timeline:
      item?.tables && item.tables.length > 0
        ? item.tables.map((table) => `Seats: ${table?.seats}`)
        : ["N/A"],
    kitchens: item?.kitchens || [],
    atmospheres: item?.atmospheres || [],
    facilities: item?.facilities || [],
    areas: item?.areas || [],
    menuTypes: item?.menuTypes || [],
    // Convert `is_approved` to boolean
    is_approved: item?.is_approved === 1,
    is_favorite: item?.is_favorite === 0,
    status: item?.status,
    type: item?.type,
  }));
};

export const transformSingleImageData = (apiResponse) => {
  // Ensure apiResponse is always treated as an array
  const data = Array.isArray(apiResponse) ? apiResponse : [apiResponse];

  return data.map((item) => ({
    id: item?.id,
    title: item?.name,
    location: item?.address || "N/A",
    images:
      item?.galleries && item.galleries.length > 0
        ? [item.galleries[0]?.image] // Use only the first image from galleries
        : [fallback],
    rating:
      item?.ratings_of_hotel && item.ratings_of_hotel.length > 0
        ? item.ratings_of_hotel.reduce((acc, rate) => {
            const totalRating = parseFloat(rate.total_rating) || 0;
            const count = rate.count || 1; // Avoid division by zero
            return acc + totalRating / count;
          }, 0) / item.ratings_of_hotel.length // Average across all hotels
        : "N/A",
    cuisine:
      item?.kitchens && item.kitchens.length > 0
        ? item.kitchens.map((kitchen) => kitchen?.name).join(", ")
        : "N/A",
    timeline:
      item?.tables && item.tables.length > 0
        ? item.tables.map((table) => `Seats: ${table?.seats}`)
        : ["N/A"],
    kitchens: item?.kitchens || [],
    atmospheres: item?.atmospheres || [],
    facilities: item?.facilities || [],
    areas: item?.areas || [],
    menuTypes: item?.menuTypes || [],
    // Convert `is_approved` to boolean
    is_approved: item?.is_approved === 1,
    is_favorite: item?.is_favorite === 1,
    status: item?.status,
    type: item?.type,
  }));
};
