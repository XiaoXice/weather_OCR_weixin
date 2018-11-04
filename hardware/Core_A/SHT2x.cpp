#include <stdint.h>
#include <math.h>
#include <Arduino.h>
#include <Wire.h>
#include "SHT2x.h"

// Specify the constants for water vapor and barometric pressure.
#define WATER_VAPOR 17.62f
#define BAROMETRIC_PRESSURE 243.5f

typedef enum {
    eSHT2xAddress = 0x40,
} HUM_SENSOR_T;

typedef enum {
    eTempHoldCmd        = 0xE3,
    eRHumidityHoldCmd   = 0xE5,
    eTempNoHoldCmd      = 0xF3,
    eRHumidityNoHoldCmd = 0xF5,
} HUM_MEASUREMENT_CMD_T;


/******************************************************************************
 * Global Functions
 ******************************************************************************/

/**********************************************************
 * GetHumidity
 *  Gets the current humidity from the sensor.
 *
 * @return float - The relative humidity in %RH
 **********************************************************/
float SHT2xClass::GetHumidity(void)
{
    float value = readSensor(eRHumidityHoldCmd);
    if (value == 0) {
        return 0;                       // Some unrealistic value
    }
    return -6.0 + 125.0 / 65536.0 * value;
}

/**********************************************************
 * GetTemperature
 *  Gets the current temperature from the sensor.
 *
 * @return float - The temperature in Deg C
 **********************************************************/
float SHT2xClass::GetTemperature(void)
{
    float value = readSensor(eTempHoldCmd);
    if (value == 0) {
        return -273;                    // Roughly Zero Kelvin indicates an error
    }
    return -46.85 + 175.72 / 65536.0 * value;
}

/**********************************************************
 * GetDewPoint
 *  Gets the current dew point based on the current humidity and temperature
 *
 * @return float - The dew point in Deg C
 **********************************************************/
float SHT2xClass::GetDewPoint(void)
{
  float humidity = GetHumidity();
  float temperature = GetTemperature();

  // Calculate the intermediate value 'gamma'
  float gamma = log(humidity / 100) + WATER_VAPOR * temperature / (BAROMETRIC_PRESSURE + temperature);
  // Calculate dew point in Celsius
  float dewPoint = BAROMETRIC_PRESSURE * gamma / (WATER_VAPOR - gamma);

  return dewPoint;
}

/******************************************************************************
 * Private Functions
 ******************************************************************************/

uint16_t SHT2xClass::readSensor(uint8_t command)
{
    uint16_t result;

    Wire.beginTransmission(eSHT2xAddress);
    Wire.write(command);
    Wire.endTransmission();
    delay(100);

    Wire.requestFrom(eSHT2xAddress, 3);
    uint32_t timeout = millis() + 300;       // Don't hang here for more than 300ms
    while (Wire.available() < 3) {
        if ((millis() - timeout) > 0) {
            return 0;
        }
    }

    //Store the result
    result = Wire.read() << 8;
    result += Wire.read();
    result &= ~0x0003;   // clear two low bits (status bits)

    //Clear the final byte from the buffer
    Wire.read();

    return result;
}

SHT2xClass SHT2x;