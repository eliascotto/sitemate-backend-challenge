from flask import Flask, request, jsonify
import sqlite3
import json
import os

app = Flask(__name__)

store = {}
id_counter = 0


def get_db_connection():
    conn = sqlite3.connect('resources/issues.db')
    conn.row_factory = sqlite3.Row
    return conn


def load_json(file_path):
    global store, id_counter
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        
        for issue in data:
            if all(key in issue for key in ('id', 'title', 'description')):
                store[id_counter] = {
                    'title': issue['title'],
                    'description': issue['description']
                }
                id_counter += 1
            else:
                print(f"Format error for issue: {issue}")
        
        print(f"Loaded {len(store)} issues from {file_path}")
    except Exception as e:
        print(f"Error loading issues at path {file_path}: {str(e)}")

load_json('resources/issues.json')

# IN MEMORY

@app.route("/api/issues", methods=['GET'])
def get_issues():
    return jsonify(store)


@app.route('/api/issues/<int:issue_id>', methods=['GET'])
def get_issue(issue_id):
    issue = store.get(issue_id)
    if issue:
        return jsonify(issue)
    return jsonify({'error': 'Issue not found'}), 404


@app.route('/api/issues', methods=['POST'])
def create_issue():
    global id_counter
    data = request.json
    print(f"New JSON received: {data}")
    if all(key in data for key in ('title', 'description')):
        new_issue = {
            'title': data['title'],
            'description': data['description']
        }
        store[id_counter] = new_issue
        id_counter += 1
        return jsonify(new_issue), 201
    else:
        return jsonify({'error': 'Malformed data'}), 400


@app.route('/api/issues/<int:issue_id>', methods=['PUT'])
def update_issue(issue_id):
    if issue_id in store:
        data = request.json
        print(f"New JSON received to update issue {issue_id}: {data}")
        if all(key in data for key in ('title', 'description')):
            store[issue_id]['title'] = data['title']
            store[issue_id]['description'] = data['description']
            return jsonify(store[issue_id])
        else:
            return jsonify({'error': 'Malformed data'}), 400
    return jsonify({'error': 'Issue not found'}), 404


@app.route('/api/issues/<int:issue_id>', methods=['DELETE'])
def delete_issue(issue_id):
    if issue_id in store:
        print(f"Deleting issue {issue_id}")
        del store[issue_id]
        return '', 204
    return jsonify({'error': 'Issue not found'}), 404


# SQLITE

@app.route("/api/v2/issues", methods=['GET'])
def get_issuesv2():
    conn = get_db_connection()
    issues = conn.execute('SELECT * FROM issues').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in issues])


@app.route('/api/v2/issues/<int:issue_id>', methods=['GET'])
def get_issuev2(issue_id):
    conn = get_db_connection()
    issue = conn.execute('SELECT * FROM issues WHERE id = ?', (issue_id,)).fetchone()
    conn.close()
    if issue is None:
        return jsonify({'error': 'Issue not found'}), 404
    return jsonify(dict(issue))


@app.route('/api/v2/issues', methods=['POST'])
def create_issuev2():
    global id_counter
    data = request.json
    print(f"New JSON received: {data}")
    if all(key in data for key in ('title', 'description')):
        new_issue = {
            'title': data['title'],
            'description': data['description']
        }
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO issues (title, description) VALUES (?, ?)',
                    (data['title'], data['description']))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        return jsonify(new_issue), 201
    else:
        return jsonify({'error': 'Malformed data'}), 400


@app.route('/api/v2/issues/<int:issue_id>', methods=['PUT'])
def update_issuev2(issue_id):
    if issue_id in store:
        data = request.json
        print(f"New JSON received to update issue {issue_id}: {data}")
        if all(key in data for key in ('title', 'description')):
            updated = {
                'title': data['title'],
                'description': data['description']
            }
            conn = get_db_connection()
            conn.execute('UPDATE issues SET title = ?, description = ? WHERE id = ?',
                        (data['title'], data['description'], issue_id))
            conn.commit()
            conn.close()
            return jsonify(updated)
        else:
            return jsonify({'error': 'Malformed data'}), 400
    return jsonify({'error': 'Issue not found'}), 404


@app.route('/api/v2/issues/<int:issue_id>', methods=['DELETE'])
def delete_issuev2(issue_id):
    if issue_id in store:
        print(f"Deleting issue {issue_id}")
        conn = get_db_connection()
        conn.execute('DELETE FROM issues WHERE id = ?', (issue_id,))
        conn.commit()
        conn.close()
        return '', 204
    return jsonify({'error': 'Issue not found'}), 404