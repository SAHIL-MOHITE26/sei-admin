import React, { useState, useCallback, useEffect } from 'react';
import { LoadScript, GoogleMap, Autocomplete, Marker } from '@react-google-maps/api';
import { FaSearchLocation, FaBuilding, FaLandmark, FaCity} from 'react-icons/fa'; // Import icons

const libraries: ('places')[] = ['places'];

const containerStyle = {
  display: 'flex',
  height: '100vh',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
};

const contentStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '90vh',
  borderRadius: '20px',
  overflow: 'hidden',
  backgroundColor: 'white',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const formStyle = {
  flex: 1,
  padding: '20px',
  backgroundColor: 'white', // Background color of the form
  
};

const mapStyle = {
  flex: 1,
  borderRadius: '20px',
};

const mapContainerStyle = {
  width: '150%',
  height: '80%',
};

const defaultCenter = { lat: 40.7128, lng: -74.0060 };

const AddressForm: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [formData, setFormData] = useState({
    building: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [errors, setErrors] = useState<{ address?: string }>({});
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral>(defaultCenter);

  useEffect(() => {
    // Function to handle location fetching
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newLocation);
          setMarkerPosition(newLocation); // Set marker at user's location
        }, () => {
          console.error("Error fetching location");
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    fetchUserLocation();
  }, []);

  const geocodePosition = useCallback(async (position: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({ location: position });

    if (response.results[0]) {
      setAddress(response.results[0].formatted_address);
      const addressComponents = response.results[0].address_components;

      const newFormData = {
        building: '',
        landmark: '',
        city: '',
        state: '',
        pincode: ''
      };

      addressComponents.forEach((component) => {
        const types = component.types;

        if (types.includes('street_number') || types.includes('route')) {
          newFormData.building += component.long_name + ' ';
        }
        if (types.includes('sublocality') || types.includes('neighborhood')) {
          newFormData.landmark = component.long_name;
        }
        if (types.includes('locality')) {
          newFormData.city = component.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          newFormData.state = component.long_name;
        }
        if (types.includes('postal_code')) {
          newFormData.pincode = component.long_name;
        }
      });

      setFormData(newFormData);
      setErrors((prev) => ({ ...prev, address: '' }));
    } else {
      console.log('No results found');
    }
  }, []);

  const handlePlaceChanged = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;

      setAddress(place.formatted_address || '');
      if (location && map) {
        const newPos = { lat: location.lat(), lng: location.lng() };
        setMarkerPosition(newPos);
        map.panTo(newPos);
        geocodePosition(newPos);
      }
    }
  }, [autocomplete, map, geocodePosition]);

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const newPos = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        setMarkerPosition(newPos);
        geocodePosition(newPos);
      }
    },
    [geocodePosition]
  );

  const handleMarkerDragEnd = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const newPos = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        setMarkerPosition(newPos);
        geocodePosition(newPos);
      }
    },
    [geocodePosition]
  );

  const validateForm = useCallback(() => {
    const newErrors: { address?: string } = {};
    if (!address) {
      newErrors.address = 'Address is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Form submitted successfully!');
      // Handle form submission (e.g., send data to a server)
    }
  };

  return (
    <>
    <div style={containerStyle}>
      <div style = {contentStyle}>
        <div style={formStyle}>
          <h2 style={{ fontWeight: 'bold', fontSize: '32px', marginBottom:"10px" }}>Address Form</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'none' }}>Search Location:</label>
              <LoadScript
                googleMapsApiKey="AIzaSyBWhEsvwQCfdADKWZFucxY3BBVmhj43K4g"
                libraries={libraries}
              >
                <Autocomplete
                  onLoad={setAutocomplete}
                  onPlaceChanged={handlePlaceChanged}
                >
                  <div style={{ position: 'relative' }}>
                    <FaSearchLocation style={{ position: 'absolute', top: '60%', left: '10px', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Search Location"
                      style={{ width: '100%', padding: '10px 10px 10px 40px', marginTop: '10px', borderRadius: '10px', border: '1px solid black' }}
                    />
                  </div>
                </Autocomplete>
              </LoadScript>
              {errors.address && (
                <div style={{ color: 'red', marginTop: '5px' }}>
                  {errors.address}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'none' }}>Enter Building/Flat:</label>
              <div style={{ position: 'relative' }}>
                <FaBuilding style={{ position: 'absolute', top: '60%', left: '10px', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  placeholder="Enter Building/Flat"
                  style={{ width: '100%', padding: '10px 10px 10px 40px', marginTop: '10px', borderRadius: '10px', border: '1px solid black' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'none' }}>Enter Landmark:</label>
              <div style={{ position: 'relative' }}>
                <FaLandmark style={{ position: 'absolute', top: '60%', left: '10px', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="Enter Landmark"
                  style={{ width: '100%', padding: '10px 10px 10px 40px', marginTop: '10px', borderRadius: '10px', border: '1px solid black' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'none' }}>Enter City:</label>
              <div style={{ position: 'relative' }}>
                <FaCity style={{ position: 'absolute', top: '60%', left: '10px', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter City"
                  style={{ width: '100%', padding: '10px 10px 10px 40px', marginTop: '10px', borderRadius: '10px', border: '1px solid black' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'none' }}>Enter State:</label>
              <div style={{ position: 'relative' }}>
                
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Enter State"
                  style={{ width: '100%', padding: '10px 10px 10px 40px', marginTop: '10px', borderRadius: '10px', border: '1px solid black' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'none' }}>Enter Pincode:</label>
              <div style={{ position: 'relative' }}>
                
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="Enter Pincode"
                  style={{ width: '100%', padding: '10px 10px 10px 40px', marginTop: '10px', borderRadius: '10px', border: '1px solid black' }}
                />
              </div>
            </div>

            <button type="submit" style={{ padding: '2px 243px', background: 'blue', color: 'white', borderRadius: '10px', border: 'none' }}>
              Submit
            </button>
          </form>
        </div>

        <div style={mapStyle}>
          <LoadScript
            googleMapsApiKey="AIzaSyBWhEsvwQCfdADKWZFucxY3BBVmhj43K4g"
            libraries={libraries}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={markerPosition || userLocation} // Use user's location if available
              zoom={12}
              onLoad={setMap}
              onClick={handleMapClick}
            >
              {markerPosition && (
                <Marker
                  position={markerPosition}
                  draggable={true}
                  onDragEnd={handleMarkerDragEnd}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
    </>
  );
};

export default AddressForm;