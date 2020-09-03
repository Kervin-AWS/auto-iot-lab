// Publish Data from car devices - iot.js

/*
* Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*  http://aws.amazon.com/apache2.0
*
* or in the "license" file accompanying this file. This file is distributed
* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
* express or implied. See the License for the specific language governing
* permissions and limitations under the License.
*/

// Require AWS IoT Device SDK
const awsIoT = require('aws-iot-device-sdk');

// Require crypto for random numbers generation
const crypto = require('crypto');

// Fetch the deviceName from the folder name
const deviceName = 'car-01';
const endpointAddress = 'a1ba8o0iqbelxz.ats.iot.cn-north-1.amazonaws.com.cn'
// Create the thingShadow object with argument data
const device = awsIoT.device({
   keyPath: 'private.pem.key',
  certPath: 'certificate.pem.crt',
    caPath: 'root-CA.pem',
  clientId: deviceName,
      host: endpointAddress
});
// Function that gets executed when the connection to IoT is established
device.on('connect', function() {
    console.log('Connected to AWS IoT');
    
    // Start the publish loop
    infiniteLoopPublish();
});
// Function sending car telemetry data every 5 seconds
function infiniteLoopPublish() {
    console.log('Sending car telemetry data to AWS IoT for ' + deviceName);
    // Publish car data to edx/telemetry topic with getCarData
    const publish_topic = "auto/" + deviceName
    device.publish(publish_topic, JSON.stringify(getCarData(deviceName)));
    
    // Start Infinite Loop of Publish every 5 seconds
    setTimeout(infiniteLoopPublish, 5000);
}
// Function to create a random float between minValue and maxValue
function randomFloatBetween(minValue,maxValue){
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue));
}
// Generate random car data based on the deviceName
function getCarData(deviceName) {
    let message = {
        'trip_id': crypto.randomBytes(15).toString('hex'),
        'engine_speed_mean': randomFloatBetween(700.55555, 3000.55555),
        'fuel_level': randomFloatBetween(0, 100),
        'high_acceleration_event': randomFloatBetween(0, 12),
        'high_breaking_event': randomFloatBetween(0, 4),
        'odometer': randomFloatBetween(0.374318249, 8.142630049),
        'oil_temp_mean': randomFloatBetween(12.7100589, 205.3165256)
    };
    const device_data = { 
        'car': {
            'vin': 'I5Z45ZSGBRZFU4YRM',
            'latitude':39.122229,
            'longitude':-77.133578
        }
    };
    message['vin'] = device_data['car'].vin;
    message['latitude'] = device_data['car'].latitude;
    message['longitude'] = device_data['car'].longitude;
    message['device'] = deviceName;
    message['datetime'] = new Date().toISOString().replace(/\..+/, '');
    return message;
}
