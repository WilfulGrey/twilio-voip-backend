# Twilio VoIP Backend

Backend do generowania tokenów autoryzacji dla połączeń VoIP w Twilio.

## Instalacja

1. Zainstaluj zależności:
```bash
npm install
```

2. Skopiuj `.env.example` do `.env` i uzupełnij dane Twilio:
```bash
cp .env.example .env
```

3. Wypełnij zmienne środowiskowe w pliku `.env`:
- `TWILIO_ACCOUNT_SID` - Twoje Account SID z konsoli Twilio
- `TWILIO_AUTH_TOKEN` - Twój Auth Token z konsoli Twilio  
- `TWILIO_API_KEY` - API Key (stwórz w konsoli Twilio)
- `TWILIO_API_SECRET` - API Secret
- `TWILIO_PHONE_NUMBER` - Twój numer telefonu Twilio
- `TWILIO_TWIML_APP_SID` - SID aplikacji TwiML (opcjonalne)

## Uruchomienie

### Lokalnie

#### Produkcja
```bash
npm start
```

#### Rozwój
```bash
npm run dev
```

Serwer uruchomi się na porcie 3000 (lub PORT z .env).

### Docker

#### Zbuduj i uruchom kontener
```bash
docker-compose up --build
```

#### Uruchom w tle
```bash
docker-compose up -d
```

#### Zatrzymaj kontener
```bash
docker-compose down
```

Kontener będzie dostępny na `http://localhost:3000`.

### Render.com (Production)

1. **Przygotuj repozytorium GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/twój-username/twilio-voip-backend
   git push -u origin main
   ```

2. **Deploy na Render:**
   - Idź na [render.com](https://render.com)
   - Zarejestruj się/zaloguj
   - Kliknij "New +" → "Web Service"
   - Połącz GitHub i wybierz swoje repo
   - Render automatycznie wykryje `render.yaml`

3. **Skonfiguruj zmienne środowiskowe w Render Dashboard:**
   - `TWILIO_ACCOUNT_SID` - Twoje Account SID
   - `TWILIO_AUTH_TOKEN` - Twój Auth Token
   - `TWILIO_API_KEY` - API Key z Twilio Console
   - `TWILIO_API_SECRET` - API Secret
   - `TWILIO_PHONE_NUMBER` - Twój numer Twilio
   - `TWILIO_TWIML_APP_SID` - TwiML App SID (opcjonalne)

4. **Deploy automatyczny:**
   - Render automatycznie zbuuje i wdroży aplikację
   - Dostaniesz URL typu: `https://twilio-voip-backend-xxxx.onrender.com`
   - Aplikacja ma automatyczne HTTPS i health check

**Zalety Render:**
- ✅ Darmowy tier na start
- ✅ Automatyczne HTTPS
- ✅ CI/CD z GitHub
- ✅ Health monitoring
- ✅ Skalowanie automatyczne

## API Endpoints

### POST /token
Generuje Access Token dla klienta VoIP.

**Request Body:**
```json
{
  "identity": "user123",
  "allowIncomingCalls": true
}
```

**Response:**
```json
{
  "identity": "user123",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /make-call
Generuje TwiML dla realizacji połączenia.

**Request Body:**
```json
{
  "to": "+48123456789",
  "from": "+48987654321",
  "identity": "user123"
}
```

**Response:** TwiML XML

### GET /health
Sprawdza status serwera.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Użycie tokena w aplikacji klienckiej

Token możesz użyć w Twilio Client SDK do autoryzacji połączeń VoIP.