import React from 'react'
import ManualIcon from './icon/ManualIcon'
import AutomaticIcon from './icon/AutomaticIcon'
import InfotainmentSystemIcon from './icon/InfotainmentSystemIcon'
import RearACIcon from './icon/RearACIcon';
import SunroofIcon from './icon/SunroofIcon';
import LeatherUpholsteryIcon from './icon/LeatherUpholsteryIcon';
import AlloyWheelsIcon from './icon/AlloyWheelsIcon';
import BluetoothIcon from './icon/BluetoothIcon';
import CarPlayIcon from './icon/CarPlayIcon';
import ParkingAssistIcon from './icon/ParkingAssistIcon';
import CruiseControlIcon from './icon/CruiseControlIcon';
import PushButtonStartIcon from './icon/PushButtonStartIcon';
import SpecialNumberIcon from './icon/SpecialNumberIcon';
import TopModelIcon from './icon/TopModelIcon';
import VentilatedSeatsIcon from './icon/VentilatedSeatsIcon';
import CameraIcon from './icon/CameraIcon';
import GPSNavigationIcon from './icon/GPSNavigationIcon';
import TMPSIcon from './icon/TMPSIcon';
import User1Icon from './icon/User1Icon';
import User2Icon from './icon/User2Icon';
import User3Icon from './icon/User3Icon';
import User4Icon from './icon/User4Icon';
import RatingStarColor from './icon/RatingStarColor';
import RatingStarEmpty from './icon/RatingStarEmpty';

interface AllIconComponentProps {
    width: number;
    height: number;
    color: string;
    icon: string;
}

const AllIconComponent = ({ width, height, color, icon }: AllIconComponentProps) => {
    return (
        <>
            {icon === 'automaticIcon' && <AutomaticIcon width={width} height={height} color={color} />}
            {icon === 'manualIcon' && <ManualIcon width={width} height={height} color={color} />}
            {icon === 'infotainmentSystemIcon' && <InfotainmentSystemIcon width={width} height={height} color={color} />}
            {icon === 'rearACIcon' && <RearACIcon width={width} height={height} color={color} />}
            {icon === 'sunroofIcon' && <SunroofIcon width={width} height={height} color={color} />}
            {icon === 'leatherUpholsteryIcon' && <LeatherUpholsteryIcon width={width} height={height} color={color} />}
            {icon === 'alloyWheelsIcon' && <AlloyWheelsIcon width={width} height={height} color={color} />}
            {icon === 'bluetoothIcon' && <BluetoothIcon width={width} height={height} color={color} />}
            {icon === 'carPlayIcon' && <CarPlayIcon width={width} height={height} color={color} />}
            {icon === 'parkingAssistIcon' && <ParkingAssistIcon width={width} height={height} color={color} />}
            {icon === 'cruiseControlIcon' && <CruiseControlIcon width={width} height={height} color={color} />}
            {icon === 'pushButtonStartIcon' && <PushButtonStartIcon width={width} height={height} color={color} />}
            {icon === 'specialNumberIcon' && <SpecialNumberIcon width={width} height={height} color={color} />}
            {icon === 'topModelIcon' && <TopModelIcon width={width} height={height} color={color} />}
            {icon === 'ventilatedSeatsIcon' && <VentilatedSeatsIcon width={width} height={height} color={color} />}
            {icon === 'cameraIcon' && <CameraIcon width={width} height={height} color={color} />}
            {icon === 'gpsNavigationIcon' && <GPSNavigationIcon width={width} height={height} color={color} />}
            {icon === 'tmpsIcon' && <TMPSIcon width={width} height={height} color={color} />}
            {icon === 'user1Icon' && <User1Icon width={width} height={height} color={color} />}
            {icon === 'user2Icon' && <User2Icon width={width} height={height} color={color} />}
            {icon === 'user3Icon' && <User3Icon width={width} height={height} color={color} />}
            {icon === 'user4Icon' && <User4Icon width={width} height={height} color={color} />}
            {icon === 'ratingStarColor' && <RatingStarColor width={width} height={height} color={color} />}
            {icon === 'ratingStarEmpty' && <RatingStarEmpty width={width} height={height} color={color} />}
        </>
    )
}

export default AllIconComponent;