import React, { forwardRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import Geocode from "react-geocode";

import "@reach/combobox/styles.css";

import "./map.css"
import { IonButton } from "@ionic/react";
import { isPlatform } from "@ionic/core";
import { connect } from "react-redux";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const center = {
  lat: 7.3775,
  lng: 3.9470,
};

const styles = {
  locateBtn: {
    position: "absolute",
    top: isPlatform("mobile") ? "4rem" : "1rem",
    right: isPlatform("mobile") ? "0.5rem" : "1rem",
    background: "none",
    border: "none",
    zIndex: 10
  },
  selectBtn: {
    position: "absolute",
    top: isPlatform("mobile") ? "4rem" : "1rem",
    left: isPlatform("mobile") ? "0.5rem" : "1rem",
    zIndex: 10,
    margin: 0,
    padding: 0,
  }
}


Geocode.setApiKey(/* --Apikey-- */);
Geocode.setLocationType("ROOFTOP");


const Map = ({ updateAddress, address, location }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: // --Apikey--,
      libraries,
  });
  const [marker, setMarker] = React.useState({});

  const markerRef = React.useRef()
  const onMarkerLoad = React.useCallback((marker) => {
    markerRef.current = marker
  }, [])

  const searchBoxRef = React.useRef()
  const locateBtnRef = React.useRef()

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
    locateBtnRef.current.click();
  }, []);


  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(18);
  }, []);

  const markerPositionChangeHandler = (e) => {
    setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() })
    Geocode.fromLatLng(`${markerRef.current.props.position.lat}`, `${markerRef.current.props.position.lng}`).then(
      (response) => {
        const userAddress = response.results[0].formatted_address;
        const userLocation = {
          lat: markerRef.current.props.position.lat,
          lng: markerRef.current.props.position.lng
        }
        updateAddress(userAddress, userLocation)
        searchBoxRef.current.value = userAddress
      },
      (error) => {
        console.error(error);
      }
    );
  }

  if (loadError) return "Error loading map";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <IonButton style={styles.selectBtn} routerLink="/ordersummary" routerDirection="back">
        Done
      </IonButton>

      <Locate panTo={panTo}
        setMarker={setMarker}
        searchBoxRef={searchBoxRef}
        ref={locateBtnRef}
        updateAddress={updateAddress}
        location={location}
        address={address}
      />
      <Search panTo={panTo}
        setMarker={setMarker}
        ref={searchBoxRef}
      />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {marker.lat && <Marker
          position={{ lat: marker.lat, lng: marker.lng }}
          draggable
          ref={markerRef}
          onLoad={onMarkerLoad}
          onDragEnd={markerPositionChangeHandler}
          icon={{
            url: `/assets/marker.jpg`,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(40, 40),
            scaledSize: new window.google.maps.Size(50, 50),
          }}
        />}
      </GoogleMap>
      {/* <IonToast
        isOpen={openToast}
        message="Drag pin to adjust location"
        duration={2000}
        color="primary"
        className="ion-text-center"
        position="middle"
      /> */}
    </div>
  );
}

const Locate = forwardRef(({ panTo, setMarker, searchBoxRef, updateAddress, location }, ref) => {
  return (
    <>
      <IonButton
        color="primary"
        className="locate"
        style={styles.locateBtn}
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
              setMarker({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              })
              Geocode.fromLatLng(`${position.coords.latitude}`, `${position.coords.longitude}`).then(
                (response) => {
                  const address = response.results[0].formatted_address;
                  const ulocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  }
                  updateAddress(address, ulocation)
                  searchBoxRef.current.value = address
                },
                (error) => {
                  console.error(error);
                }
              );
            },
            () => null
          );
        }}
      >
        <img src="/assets/compass.svg" alt="compass" />
      </IonButton>
      <IonButton
        style={{ display: "none" }}
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            () => {
              panTo({
                lat: location.lat,
                lng: location.lng,
              });
              setMarker({
                lat: location.lat,
                lng: location.lng
              })
              Geocode.fromLatLng(`${location.lat}`, `${location.lng}`).then(
                (response) => {
                  const address = response.results[0].formatted_address;
                  const ulocation = {
                    lat: location.lat,
                    lng: location.lng
                  }
                  updateAddress(address, ulocation)
                  searchBoxRef.current.value = address
                },
                (error) => {
                  console.error(error);
                }
              );
            },
            () => null
          );
        }}
        ref={ref}
      >
      </IonButton>
    </>
  );
})

const Search = forwardRef(({ panTo, setMarker }, ref) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 7.3775, lng: () => 3.9470 },
      radius: 100 * 1000,
    },
  });
  // debugger

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
      setMarker({ lat: lat, lng: lng })
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <div className="search" style={{ maxWidth: isPlatform("mobile") ? "100%" : "500px" }}>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Enter your address"
          ref={ref}
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
})

const mapStateToProps = (state) => (
  {
    address: state.address,
    location: state.location
  }
)

const mapDispatchToProps = dispatch => {
  return {
    updateAddress: (address, location) => dispatch({ type: "UPDATEADDRESS", address: address, location: location })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)
