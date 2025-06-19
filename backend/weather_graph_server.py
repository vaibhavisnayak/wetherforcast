# weather_graph_server.py

from flask import Flask, request, send_file, render_template
import matplotlib.pyplot as plt
import io
import requests
import os

app = Flask(__name__)

API_KEY = 'cb02c00e3a2d4244320d0652909cf5cf'  # Replace with your actual OpenWeatherMap API key

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/weather-graph')
def weather_graph():
    city = request.args.get('city', 'London')
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    res = requests.get(url).json()

    # Handle API error
    if res.get("cod") != "200":
        return f"Error fetching weather data: {res.get('message', 'Unknown error')}"

    dates = []
    temps = []
    for item in res['list'][:8]:  # Next 24 hours (3-hour intervals)
        dates.append(item['dt_txt'])
        temps.append(item['main']['temp'])

    # Plotting the graph
    plt.figure(figsize=(10, 4))
    plt.plot(dates, temps, marker='o', linestyle='-', color='blue')
    plt.xticks(rotation=45)
    plt.title(f'Temperature Forecast for {city}')
    plt.xlabel('Time')
    plt.ylabel('Temperature (°C)')
    plt.grid(True)
    plt.tight_layout()

    # Save plot to in-memory buffer
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    return send_file(img, mimetype='image/png')

# Required for Render/production deployment
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Default for local
    app.run(host='0.0.0.0', port=port)
