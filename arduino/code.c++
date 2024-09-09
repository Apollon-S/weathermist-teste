#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

#define RELE_PIN 3
#define DHT_PIN 2
#define DHTTYPE DHT22
#define INTERVALO 5000

DHT dht(DHT_PIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  Serial.begin(9600);
  Serial.println("INICIANDO SISTEMA");
  dht.begin();
  lcd.init();
  lcd.backlight();
  lcd.setCursor(3, 0);
  lcd.print("INICIANDO");
  delay(5000);
  lcd.clear();
  pinMode(RELE_PIN, OUTPUT);
}

void loop() {

  
  // Lê a mensagem recebida pela serial
  if (Serial.available() > 0) {
    String comando = Serial.readStringUntil('\n');
    comando.trim();  // Remove espaços em branco no início e no fim

    if (comando.equalsIgnoreCase("ligar")) {
      digitalWrite(RELE_PIN, LOW);  // Liga o relé
      Serial.println("Rele ligado");
 
    } 
    else if (comando.equalsIgnoreCase("desligar")) {
      digitalWrite(RELE_PIN, HIGH);  // Desliga o relé
      Serial.println("Rele desligado");
  
    }
  }

  // Código para ler o sensor e exibir na tela LCD
  float h = dht.readHumidity();
  float t = dht.readTemperature();





  if (isnan(h) || isnan(t) || t == 0 || h == 0) {
    Serial.println(F("Falha na leitura do sensor"));
    lcd.setCursor(0, 0);
    lcd.print("Falha no sensor DHT22");
  } else {
    Serial.print(t);
    Serial.print("ºC, ");
    Serial.print(h);
    Serial.println("%");

    lcd.clear();
    lcd.setCursor(0, 0); 
    lcd.print("Temp.: ");
    lcd.print(t);
    lcd.print("C");
    lcd.setCursor(0, 1);
    lcd.print("Umidade: ");
    lcd.print(h);
    lcd.print("%");
  }

  delay(2000);
}
