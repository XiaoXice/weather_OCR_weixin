#ifndef SHT2X_H
#define SHT2X_H

#include <stdint.h>

class SHT2xClass
{
  private:
    uint16_t readSensor(uint8_t command);

  public:
    float GetHumidity(void);
    float GetTemperature(void);
    float GetDewPoint(void);
};

extern SHT2xClass SHT2x;

#endif