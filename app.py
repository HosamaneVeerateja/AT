from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Create the database
def init_db():
    conn = sqlite3.connect('expenses.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Add expense to the database
def add_expense(category, amount, date):
    conn = sqlite3.connect('expenses.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO expenses (category, amount, date) VALUES (?, ?, ?)', 
                   (category, amount, date))
    conn.commit()
    conn.close()

# Get monthly report
def get_monthly_report(month, year):
    conn = sqlite3.connect('expenses.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT category, SUM(amount) FROM expenses 
        WHERE strftime('%m', date) = ? AND strftime('%Y', date) = ?
        GROUP BY category
    ''', (month, year))
    report = cursor.fetchall()
    conn.close()
    return report

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_expense', methods=['POST'])
def add_expense_route():
    data = request.json
    add_expense(data['category'], data['amount'], data['date'])
    return jsonify({"status": "success"})

@app.route('/monthly_report/<month>/<year>', methods=['GET'])
def monthly_report_route(month, year):
    report = get_monthly_report(month, year)
    return jsonify(report)

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
