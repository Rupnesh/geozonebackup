import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Gmaps, Marker } from 'react-gmaps';
import Geolocation from 'react-geolocation';
import { socketConnect } from 'socket.io-react';

const params = { v: '3.exp', key: 'AIzaSyA4g55XM4i-GYszYdIY0K8D8ya5pet12lI' };

class CollectionsView extends PureComponent {
  
  state = {
    lat: 52.50277778,
    lon: 13.27583333
  };
  
  componentDidMount() {
    const { socket } = this.props;
    socket && socket.emit('subscribe', 'GPSJSON');
    socket && socket.on('data-GPSJSON', this.handleGPSJSONData);
  }
  
  componentWillUnmount() {
    const { socket } = this.props;
    socket && socket.emit('unsubscribe', 'GPSJSON');
  }
  
  handleGPSJSONData(data) {
    const parsedData = JSON.parse(data);
    // console.log(parsedData);
    switch (parsedData.class) {
      case 'TPV':
        this.handleTpv(parsedData);
        break;
    }
  }
  
  handleTpv(data) {
    let changed = true;

    if (this.state.lat === data.lat && this.state.lon === data.lon) {
      changed = false;
    }
    
    if (changed) {
      this.setState({
        lat: data.lat,
        lon: data.lon
      });
    }
  }
  
  render() {
    return (
      <div style={{
        height: '600px'
      }}>
        <Gmaps
          width={'100%'}
          height={'100%'}
          lat={this.state.lat}
          lng={this.state.lon}
          zoom={12}
          loadingMessage={'Loading map...'}
          params={params}
        >
          <Marker
            lat={this.state.lat}
            lng={this.state.lon}
            draggable={false}
          />
        </Gmaps>
      </div>
    );
  }
}

export default socketConnect(CollectionsView);
