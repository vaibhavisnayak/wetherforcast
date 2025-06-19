# weather_graph_server.py
from flask import Flask, request, send_file
import matplotlib.pyplot as plt
import io
import requests

app = Flask(__name__)

API_KEY = 'your_openweathermap_api_key'

@app.route('/weather-graph')
def weather_graph():
    city = request.args.get('city', 'London')
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    res = requests.get(url).json()

    dates = []
    temps = []
    for item in res['list'][:8]:  # Next 24 hours (3-hour intervals)
        dates.append(item['dt_txt'])
        temps.append(item['main']['temp'])

    plt.figure(figsize=(10, 4))
    plt.plot(dates, temps, marker='o')
    plt.xticks(rotation=45)
    plt.title(f'Temperature Forecast for {city}')
    plt.xlabel('Time')
    plt.ylabel('Temperature (°C)')
    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    return send_file(img, mimetype='image/png')
