import React from "react";

interface arduinoProps {
  sliderCount: Number
}

export default function ArduinoOutput(props:arduinoProps) {
    const code = `#
    const int NUM_SLIDERS = ${props.sliderCount};
    const int analogInputs[NUM_SLIDERS] = {A0, A1, A2, A3};
    
    int analogSliderValues[NUM_SLIDERS];
    
    
    void setup() { 
      for (int i = 0; i < NUM_SLIDERS; i++) {
        pinMode(analogInputs[i], INPUT);
      }
    
      Serial.begin(9600);
    
    }
       
    
    void loop() {
      updateSliderValues();
      sendSliderValues(); // Actually send data (all the time)
      // printSliderValues(); // For debug
      delay(10);
    }
    
    void updateSliderValues() {
      for (int i = 0; i < NUM_SLIDERS; i++) {
         analogSliderValues[i] = analogRead(analogInputs[i]);
      }
    }
    
    void sendSliderValues() {
      String builtString = String("");
    
      for (int i = 0; i < NUM_SLIDERS; i++) {
        builtString += String((int)analogSliderValues[i]);
    
        if (i < NUM_SLIDERS - 1) {
          builtString += String("|");
        }
      }
      
      Serial.println(builtString);
    }
    
    void printSliderValues() {
      for (int i = 0; i < NUM_SLIDERS; i++) {
        String printedString = String("Slider #") + String(i + 1) + String(": ") + String(analogSliderValues[i]) + String(" mV");
        Serial.write(printedString.c_str());
    
        if (i < NUM_SLIDERS - 1) {
          Serial.write(" | ");
        } else {
          Serial.write("\\n");
        }
      }
    }`;
    return (
        <>
            <h2>Arduino Code</h2>
            <div className="mockup-code bg-primary text-primary-content justify-start text-left">
                <pre data-prefix="$">
                    <code>{code}</code>
                </pre>
            </div>
        </>
    );
}