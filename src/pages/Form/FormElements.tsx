import React, { useState, useCallback } from 'react';
import { LoadScript, GoogleMap, Autocomplete, Marker } from '@react-google-maps/api';

const libraries: ('places')[] = ['places'];

const mapContainerStyle = {
  width: '100%',         
  height: '80%',         
  borderRadius: '15px', 
  overflow: 'hidden',   
};

const defaultCenter = { lat: 40.7128, lng: -74.0060 };

const AddressForm: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [errors, setErrors] = useState<{ address?: string }>({});

  const geocodePosition = useCallback(async (position: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({ location: position });

    if (response.results[0]) {
      setAddress(response.results[0].formatted_address);
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
      }
    }
  }, [autocomplete, map]);

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
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, padding: '20px' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '32px'}}>Address Form:</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
          <LoadScript
              googleMapsApiKey="AIzaSyBWhEsvwQCfdADKWZFucxY3BBVmhj43K4g"
              libraries={libraries}
            >
          <Autocomplete
                onLoad={setAutocomplete}
                onPlaceChanged={handlePlaceChanged}
              >
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: '100%', padding: '10px', marginTop: '10px',borderRadius:'10px' }}
            />
            </Autocomplete>
            </LoadScript>
            {errors.address && (
              <div style={{ color: 'red', marginTop: '5px' }}>
                {errors.address}
              </div>
            )}
          </div>
          
          <button type="submit" style={{ padding: '5px 260px' , background:'blue', color:'white', borderRadius:'10px'}}>
            Submit
          </button>
        </form>
      </div>
      <div style={{ flex: 1 }}>
        <LoadScript
          googleMapsApiKey="AIzaSyBWhEsvwQCfdADKWZFucxY3BBVmhj43K4g"
          libraries={libraries}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={markerPosition || defaultCenter}
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
  );
};

export default AddressForm;
