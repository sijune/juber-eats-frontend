import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { Link, useHistory } from 'react-router-dom';
import gql from 'graphql-tag';
import { ORDER_ALL_FRAGMENT } from '../../fragments';
import { useSubscription, useMutation } from '@apollo/client';
import { cookedOrders } from '../../__generated__/cookedOrders';
import { takeOrder, takeOrderVariables } from '../../__generated__/takeOrder';

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...OrderAllParts
    }
  }
  ${ORDER_ALL_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚘</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();
  // @ts-ignore
  const onSuccess = ({ coords: { latitude, longitude } }: Position) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  // @ts-ignore
  const onError = (error: PositionError) => {
    console.log(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  //이동될때마다 변경
  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      // Geocoding API
      //좌표 -> 주소등록
      //주소 -> 좌표찾기
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (results, status) => {
          //현재위치 주변 주소
          //console.log(results, status);
        },
      );
    }
  }, [driverCoords.lat, driverCoords.lng]);

  //지도 초기화
  const onGoogleApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    //map: 지도 자체
    //maps: constructor
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  //경로 - direction API
  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: '#000',
        },
      });

      directionsRenderer.setMap(map); //기존 map을 가져온다.
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
          },
          destination: {
            location: new google.maps.LatLng(driverCoords.lat + 0.05, driverCoords.lng + 0.05),
          },
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (result) => {
          console.log(result);
          directionsRenderer.setDirections(result);
        },
      );
    }
  };
  const { data: cookedOrdersData } = useSubscription<cookedOrders>(COOKED_ORDERS_SUBSCRIPTION);
  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
  }, [cookedOrdersData]);
  const history = useHistory();
  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      history.push(`/order/${cookedOrdersData?.cookedOrders.id}`);
    }
  };
  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(TAKE_ORDER_MUTATION, {
    onCompleted,
  });
  const triggerMutation = (orderId: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
    });
  };

  return (
    <div>
      <div className="overflow-hidden" style={{ height: '50vh', width: window.innerWidth }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBl5IrD58_owNbJBqMsplIrb-wTZioAiDI' }}
          defaultCenter={{ lat: 35.95, lng: 125.33 }}
          draggable={true}
          defaultZoom={16}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onGoogleApiLoaded}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrdersData?.cookedOrders.restaurant ? (
          <>
            <h1 className="text-center text-3xl font-medium">New Cooked Order</h1>
            <h1 className="text-center text-2xl font-medium my-3">
              Pick it up soon @ {cookedOrdersData.cookedOrders.restaurant.name}
            </h1>
            <button
              onClick={() => triggerMutation(cookedOrdersData.cookedOrders.id)}
              className="btn w-full mt-5 block text-center"
            >
              Accept Challenge
            </button>
          </>
        ) : (
          <h1 className="text-center text-3xl font-medium">No orders yet...</h1>
        )}
      </div>
    </div>
  );
};
