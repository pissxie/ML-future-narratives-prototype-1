#include "Adafruit_Thermal.h"
#include "SoftwareSerial.h"
#define TX_PIN 6 // Arduino transmit  YELLOW WIRE  labeled RX on printer
#define RX_PIN 5 // Arduino receive   GREEN WIRE   labeled TX on printer

SoftwareSerial mySerial(RX_PIN, TX_PIN); 
Adafruit_Thermal printer(&mySerial);  

String incoming = "";

const int BAUD_RATE = 19200;
const int LINE_WIDTH = 32;

void printWrapped(String text){

  String line = "";

  while (text.length() > 0) {
    int spaceIndex = text.indexOf(' ');

    String word;
      if (spaceIndex == -1) {
       word = text;
       text = "";
      } else {
        word = text.substring(0, spaceIndex + 1);
        text = text.substring(spaceIndex + 1);
      }

    if (line.length() + word.length() <= LINE_WIDTH) {
      line += word;
    } else {
      printer.justify('C');
      printer.println(line);

      if (random(0, 3) == 0) {       // 1 in 3 lines inverted
        printer.inverseOn();
        printer.println(line);
        printer.inverseOff();
      }

      printer.feed(random(0,2));     // breathing / pause

      line = word;
    }
  }

  if (line.length() > 0) {
    printer.justify('C'); 
    printer.println(line);
  }
}


void setup() {
  // put your setup code here, to run once:
  Serial.begin(BAUD_RATE);


  mySerial.begin(BAUD_RATE);  
  printer.begin();      

  printer.setFont('A');
  printer.doubleHeightOn();
  printer.justify('C');
  
 // printer.inverseOn();
 // printer.println(F("lorem ipsum"));
 // printer.inverseOff();
}

void loop() {
  // put your main code here, to run repeatedly:
  if (Serial.available() > 0) {
    String incoming = Serial.readStringUntil('\n');
    incoming.trim();
    Serial.print("received sending back: ");
    Serial.println(incoming);

      printWrapped(incoming);
      printer.println("");

      printer.sleep();      
      delay(3000L);        
      printer.wake();       
  }
}
