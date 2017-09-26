import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Gmaps, Marker, InfoWindow, Circle } from 'react-gmaps';
import Geolocation from 'react-geolocation';

const coords = {
  lat: 46.7731546,
  lng: 23.600299099999997
};

const params = { v: '3.exp', key: 'AIzaSyA4g55XM4i-GYszYdIY0K8D8ya5pet12lI' };

class CollectionsView extends PureComponent {
  
  state = {
    lat: 0,
    lon: 0
  };

  render() {
    return (
      <div style={{
        height: '600px'
      }}>
        <Geolocation
          onSuccess={
            (geoPos) => {
              console.log('Acolo');
              this.setState({
                lat: geoPos.coords.latitude,
                lon: geoPos.coords.longitude
              });
            }
          }
          render={({
            getCurrentPosition,
            position: { coords: { latitude, longitude } = {} } = {},
            error,
          }) =>
            <Gmaps
              width={'100%'}
              height={'100%'}
              lat={this.state.lat}
              lng={this.state.lon}
              zoom={12}
              loadingMessage={'Be happy'}
              params={params}
              onMapCreated={() => {
                setTimeout(getCurrentPosition, 0);
              }
              }>
              <Marker
                lat={coords.lat}
                lng={coords.lng}
                draggable={true}
              />
            </Gmaps>
          }
        />
      </div>
    );
  }
}

export default CollectionsView;
