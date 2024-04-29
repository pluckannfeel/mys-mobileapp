import { Municipality, PostalCode } from "../../Profile/types/address";

export function trimName(name: string): string {
  const maxLength = 30; // Maximum length you want
  if (name.length <= maxLength) {
    return name; // Return the original string if it's shorter or equal to the maximum length
  } else {
    return name.substring(0, maxLength) + "..."; // Trim the string and add an ellipsis
  }
}

// new
export function filterMunicipalitiesByPrefecture(
  municipalitiesData: Municipality[] | undefined,
  prefecture?: string
): Municipality[] | undefined {
  // Filter the municipalities based on the given prefecture
  if (prefecture) {
    return municipalitiesData?.filter(
      (municipality) => municipality.jp_prefecture === prefecture
    );
  }

  return [];
}

export function getAddressByPostalCode(
  postalCodeData: PostalCode[] | undefined,
  postalCode: string
): PostalCode[] | undefined {
  // Filter the municipalities based on the given prefecture
  if (postalCode) {
    return postalCodeData?.filter((pc) => pc.postal_code === postalCode);
  }

  return [];
}
