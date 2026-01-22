import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function AddressAutoComplete({
  value,
  onChange,
  placeholder = "Nhập địa chỉ...",
  className = "",
  disabled = false,
  error = "",
  onPlaceSelected = null,
  name = "address",
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const formatDisplayName = (item) => {
    const addr = item.address || {};

    const houseNumber = addr.house_number || "";
    const street = addr.road || addr.street || addr.pedestrian || "";
    const ward = addr.suburb || addr.quarter || addr.neighbourhood || "";
    const district = addr.county || addr.district || addr.city_district || "";
    const city = addr.city || addr.province || addr.state || "";

    const parts = [];

    // Số nhà + Đường
    if (houseNumber && street) {
      parts.push(`${houseNumber} ${street}`);
    } else if (street) {
      parts.push(street);
    }

    // Phường/Xã
    if (ward) {
      parts.push(ward);
    }

    // Quận/Huyện
    if (district) {
      parts.push(district);
    }

    const originalDisplay = item.display_name.toLowerCase();
    if (
      originalDisplay.includes("ho chi minh") ||
      originalDisplay.includes("hồ chí minh") ||
      originalDisplay.includes("hcm")
    ) {
      parts.push("Thành phố Hồ Chí Minh");
    } else if (city) {
      parts.push(city);
    }

    return parts.join(", ");
  };

  //  NOMINATIM API - OPENSTREETMAP
  const searchAddress = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          new URLSearchParams({
            q: query + ", Vietnam",
            format: "json",
            addressdetails: 1,
            countrycodes: "vn",
            limit: 10,
            "accept-language": "vi",
            dedupe: 1,
          }),
        {
          headers: {
            "User-Agent": "HG-Coffee-App/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const hcmResults = data.filter((item) => {
        const displayLower = item.display_name.toLowerCase();
        return (
          displayLower.includes("ho chi minh") ||
          displayLower.includes("hồ chí minh") ||
          displayLower.includes("hcm")
        );
      });

      const formattedSuggestions = hcmResults.map((item) => {
        const addr = item.address || {};

        const houseNumber = addr.house_number || "";
        const street = addr.road || addr.street || addr.pedestrian || "";
        const ward = addr.suburb || addr.quarter || addr.neighbourhood || "";
        const district =
          addr.county || addr.district || addr.city_district || "";

        //  Build primary line (Số nhà + Đường)
        const primaryParts = [houseNumber, street].filter(Boolean);
        const primaryLine =
          primaryParts.length > 0
            ? primaryParts.join(" ")
            : item.display_name.split(",")[0];

        //  Build secondary line (Phường, Quận, TP.HCM)
        const secondaryParts = [ward, district, "TP. Hồ Chí Minh"].filter(
          Boolean,
        );
        const secondaryLine = secondaryParts.join(", ");

        //  Build full formatted address
        const formattedAddress = formatDisplayName(item);

        return {
          display_name: formattedAddress,
          original_display: item.display_name,
          primary_line: primaryLine,
          secondary_line: secondaryLine,
          lat: item.lat,
          lon: item.lon,
          address: addr,
          place_id: item.place_id,
          house_number: houseNumber,
          street: street,
          ward: ward,
          district: district,
          city: "Thành phố Hồ Chí Minh",
        };
      });

      const sortedSuggestions = formattedSuggestions.sort((a, b) => {
        if (a.house_number && !b.house_number) return -1;
        if (!a.house_number && b.house_number) return 1;

        const mainDistricts = /quận [1-9]$|quận 1[0-2]$/i;
        const aIsMain = mainDistricts.test(a.district);
        const bIsMain = mainDistricts.test(b.district);
        if (aIsMain && !bIsMain) return -1;
        if (!aIsMain && bIsMain) return 1;

        return 0;
      });

      setSuggestions(sortedSuggestions);
      setShowSuggestions(sortedSuggestions.length > 0);
    } catch (err) {
      console.error("❌ Address search error:", err);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;

    setInputValue(newValue);

    onChange({
      target: {
        name: name,
        value: newValue,
      },
    });

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchAddress(newValue);
    }, 500);
  };

  const handleSelectSuggestion = (suggestion) => {
    const selectedAddress = suggestion.display_name;

    const addressData = {
      formatted_address: selectedAddress,
      lat: suggestion.lat,
      lon: suggestion.lon,
      city: suggestion.city,
      district: suggestion.district,
      ward: suggestion.ward,
      street: suggestion.street,
      house_number: suggestion.house_number,
      country: "Việt Nam",
    };

    console.log("📍 Selected address:", addressData);

    setInputValue(selectedAddress);

    onChange({
      target: {
        name: name,
        value: selectedAddress,
      },
    });

    if (onPlaceSelected) {
      onPlaceSelected(addressData);
    }

    setShowSuggestions(false);
    setSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="address-autocomplete-wrapper">
      <textarea
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`address-autocomplete-input ${className} ${
          error ? "error" : ""
        }`}
        disabled={disabled}
        rows={3}
        name={name}
      />

      {/* Loading indicator */}
      {loading && (
        <div className="address-autocomplete-loading">🔄 Đang tìm...</div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="address-autocomplete-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.place_id}-${index}`}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="address-autocomplete-item"
            >
              <span className="item-icon">📍</span>
              <div className="item-content">
                <div className="item-primary">{suggestion.primary_line}</div>
                {suggestion.secondary_line && (
                  <div className="item-secondary">
                    {suggestion.secondary_line}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Powered by OpenStreetMap */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="address-autocomplete-attribution">
          Powered by{" "}
          <a
            href="https://www.openstreetmap.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap
          </a>
        </div>
      )}

      {/* Error message */}
      {error && <span className="field-error">{error}</span>}

      {/* No results message */}
      {!loading &&
        showSuggestions &&
        suggestions.length === 0 &&
        inputValue.length >= 3 && (
          <div className="address-autocomplete-no-results">
            🔍 Không tìm thấy địa chỉ phù hợp
          </div>
        )}
    </div>
  );
}

AddressAutoComplete.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  onPlaceSelected: PropTypes.func,
  name: PropTypes.string,
};
