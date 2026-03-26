#include "Adafruit_Thermal.h"
#include "SoftwareSerial.h"
#define TX_PIN 6 // Arduino transmit  YELLOW WIRE  labeled RX on printer
#define RX_PIN 5 // Arduino receive   GREEN WIRE   labeled TX on printer

SoftwareSerial mySerial(RX_PIN, TX_PIN); 
Adafruit_Thermal printer(&mySerial);  

const int BAUD_RATE = 19200;

void setup() {

  mySerial.begin(BAUD_RATE);  
  printer.begin();      

  Serial.println("Ready!"); 

  printer.setFont('A');
  printer.doubleHeightOn();
  printer.justify('C');
  
  printer.inverseOn();
  printer.println(F("lorem ipsum"));
  printer.inverseOff();

  printer.println(F("lorem ipsum"));
  printer.println("");
  printer.doubleHeightOff();
  printer.println(F("lorem ipsum"));


  printer.sleep();      
  delay(3000L);        
  printer.wake();       
  printer.setDefault(); 
}

void loop() {

   if (Serial.available() > 0)
    {
        // Read the incoming value
        String incoming = Serial.readStringUntil('\n');
        incoming.trim();

        Serial.print("quote: ");
        Serial.println(incoming);
    }
}
