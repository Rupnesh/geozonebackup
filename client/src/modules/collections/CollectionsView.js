import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Gmaps, Marker } from 'react-gmaps';
import Geolocation from 'react-geolocation';

const params = { v: '3.exp', key: 'AIzaSyA4g55XM4i-GYszYdIY0K8D8ya5pet12lI' };

class CollectionsView extends PureComponent {
  
  state = {
    lat: 52.50277778,
    lon: 13.27583333
  };

  render() {
    return (
      <div style={{
        height: '600px'
      }}>
        <Geolocation
          onSuccess={
            (geoPos) => {
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
                lat={this.state.lat}
                lng={this.state.lon}
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
