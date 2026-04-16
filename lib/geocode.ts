export async function geocodeAddress(address: string) {
  if (!address) return { lat: null, lng: null };

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY não configurada.");
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao consultar geocoding.");
  }

  const data = await response.json();

  if (data.status !== "OK" || !data.results?.length) {
    return { lat: null, lng: null };
  }

  const location = data.results[0].geometry.location;

  return {
    lat: location.lat,
    lng: location.lng,
  };
}