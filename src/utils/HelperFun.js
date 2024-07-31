import { fallback } from "../assets";

export const transformData = (apiResponse) => {
  if (!apiResponse || !Array.isArray(apiResponse)) return [];
  return apiResponse.map((item) => ({
    id: item?.id,
    title: item?.name,
    location: item?.address,
    images:
      item?.galleries && item.galleries.length > 0
        ? item.galleries.map((gallery) => gallery?.image)
        : [fallback],
    rating: item?.rating || 0,
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
  }));
};

export const transformSingleImageData = (apiResponse) => {
  // Ensure apiResponse is always treated as an array
  const data = Array.isArray(apiResponse) ? apiResponse : [apiResponse];

  return data.map((item) => ({
    id: item?.id,
    title: item?.name,
    location: item?.address,
    images: item?.galleries && item.galleries.length > 0
      ? [item.galleries[0]?.image]  // Use only the first image from galleries
      : [fallback],
    rating: item?.rating || 0,
    cuisine: item?.kitchens && item.kitchens.length > 0
      ? item.kitchens.map((kitchen) => kitchen?.name).join(", ")
      : "N/A",
    timeline: item?.tables && item.tables.length > 0
      ? item.tables.map((table) => `Seats: ${table?.seats}`)
      : ["N/A"],
    kitchens: item?.kitchens || [],
    atmospheres: item?.atmospheres || [],
    facilities: item?.facilities || [],
    areas: item?.areas || [],
    menuTypes: item?.menuTypes || [],
  }));
};
