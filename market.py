from flask import Flask, render_template, request
from datetime import date as dtdate
import requests
import os
import json

app = Flask(__name__, template_folder="templates")

def fetch_market_json(date_ddmmyyyy):
    url = f"http://103.94.204.46:9080/Home/GetDashboard_DailyStatus_allMandi/?Dte={date_ddmmyyyy}"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.post(url, headers=headers)
    response.raise_for_status()
    data = response.json()
    if isinstance(data, dict):
        if "d" in data:
            data = data["d"]
        elif "Table" in data:
            data = data["Table"]
    return data

# Home page route
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/crop_care')
def crop_care():
    return render_template('crop_care.html')

# Market page route
@app.route('/market', methods=['GET', 'POST'])
def market_page():
    result = None
    today = dtdate.today()
    default_date = today.strftime("%Y-%m-%d")
    upaj_list = []
    if request.method == 'POST':
        upaj = request.form.get('upaj', '')
        date_str = request.form.get('date', default_date)
        date_tab = dtdate.fromisoformat(date_str).strftime("%d/%m/%Y")
        data = fetch_market_json(date_tab)
        upaj_set = set()
        for row in data:
            name = row.get("Upaj_Name")
            if name:
                upaj_set.add(name.strip())
        # Add custom names
        upaj_set.update([
            "बाजरा - Bajra", "सरसों - Sarson", "चना - Chana", "सोयाबीन - Soyabean",
            "आलू Potato - Potato", "गेहूं - Wheat", "प्याज Onion - Onion",
            "मूंग - Mung", "टमाटर Tomato - Tomato Tomato"
        ])
        upaj_list = sorted(upaj_set)
        upaj_filter = upaj
        table_html = "<table border='1'><tr><th>Division</th><th>District</th><th>Mandi</th><th>Upaj</th><th>Quantity</th><th>Min Rate</th><th>Max Rate</th><th>Modal Rate</th></tr>"
        matched_count = 0
        for row in data:
            upaj_text = (row.get("Upaj_Name") or "").strip().lower()
            if upaj_filter and upaj_filter.strip().lower() not in upaj_text:
                continue
            matched_count += 1
            table_html += (
                "<tr>"
                f"<td>{row.get('Division_name', '')}</td>"
                f"<td>{row.get('DistrictNameEng', '')}</td>"
                f"<td>{row.get('Mandi_Name', '')}</td>"
                f"<td>{row.get('Upaj_Name', '')}</td>"
                f"<td>{row.get('Qty', '')}</td>"
                f"<td>{row.get('MinimumRate', '')}</td>"
                f"<td>{row.get('MaximumRate', '')}</td>"
                f"<td>{row.get('Modal_Rate', '')}</td>"
                "</tr>"
            )
        if matched_count == 0:
            table_html += "<tr><td colspan='8'>No data found for this Upaj (not listed in mandi yet).</td></tr>"
        table_html += "</table>"
        result = table_html

        # Prepare data for chart
        dates = []
        modal_rates = []
        for row in data:
            upaj_text = (row.get("Upaj_Name") or "").strip().lower()
            if upaj_filter and upaj_filter.strip().lower() not in upaj_text:
                continue
            # Suppose you have a date field, e.g., row.get('Date')
            dates.append(row.get('Date', ''))
            modal_rates.append(row.get('Modal_Rate', 0))

        # Pass as JSON to the template
        return render_template(
            'market.html',
            result=result,
            default_date=date_str,
            upaj_list=upaj_list,
            upaj_value=upaj,
            chart_labels=json.dumps(dates),
            chart_data=json.dumps(modal_rates)
        )
    else:
        date_str = default_date
        upaj = ''
        date_tab = dtdate.fromisoformat(date_str).strftime("%d/%m/%Y")
        data = fetch_market_json(date_tab)
        upaj_set = set()
        for row in data:
            name = row.get("Upaj_Name")
            if name:
                upaj_set.add(name.strip())
        upaj_set.update([
            "बाजरा - Bajra", "सरसों - Sarson", "चना - Chana", "सोयाबीन - Soyabean",
            "आलू Potato - Potato", "गेहूं - Wheat", "प्याज Onion - Onion",
            "मूंग - Mung", "टमाटर Tomato - Tomato Tomato"
        ])
        upaj_list = sorted(upaj_set)
    return render_template(
        'market.html',
        result=result,
        default_date=date_str,
        upaj_list=upaj_list,
        upaj_value=upaj
    )
# Weather page route
@app.route('/weather')
def weather():
    return render_template('weather.html')  # Make sure you have templates/weather.html

@app.route('/learn')
def learn():
    return render_template('learn.html')

@app.route('/health')
def health():
    return render_template('health.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
