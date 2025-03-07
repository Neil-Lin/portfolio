export const useUserLocation = () => {
  const country = ref("TW");
  const isGeoSuccess = ref(false);

  const fetchUserCountry = async () => {
    try {
      const position = await getGeolocation();
      if (position) {
        const { latitude, longitude } = position.coords;
        console.log(`🔍 取得座標: ${latitude}, ${longitude}`);

        const countryCode = await reverseGeocode(latitude, longitude);
        if (countryCode) {
          country.value = countryCode;
          isGeoSuccess.value = true;
          return;
        }
      }
    } catch (error) {
      console.warn("❌ 無法取得地理位置，改用 IP 查詢", error);
    }
    await fetchFromIP(); // 如果 Geolocation 失敗，改用 IP API
  };

  const getGeolocation = () => {
    return new Promise<GeolocationPosition | null>((resolve) => {
      if (!("geolocation" in navigator)) {
        console.warn("❌ 瀏覽器不支援 Geolocation API");
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          console.warn("❌ Geolocation 失敗", error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 5000 },
      );
    });
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      );
      const data = await response.json();
      if (data && data.address && data.address.country_code) {
        console.log(`🌍 解析: ${data.address.country_code.toUpperCase()}`);
        return data.address.country_code.toUpperCase(); // 轉大寫，例如 "DE"
      }
    } catch (error) {
      console.warn("❌ 無法解析資訊", error);
    }
    return null;
  };

  const fetchFromIP = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      country.value = data.country_code || "TW";
      console.log(`🌍 IP 解析國家: ${country.value}`);
    } catch (error) {
      console.error("❌ 無法透過 IP 查詢，使用預設 TW", error);
    }
  };

  onMounted(() => {
    fetchUserCountry();
  });

  return { country, isGeoSuccess };
};
