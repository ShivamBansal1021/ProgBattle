from flask import Flask, request, jsonify
from flask_cors import CORS
from mongoengine import connect
from config import Config
from models import User, Team, Match, Submission, MatchLog
from werkzeug.utils import secure_filename
import os, uuid, subprocess, datetime
import re

app = Flask(__name__)
CORS(app)

connect(
    db=Config.MONGODB_SETTINGS['db'],
    host=Config.MONGODB_SETTINGS['host'],
    port=Config.MONGODB_SETTINGS['port']
)

MAX_MEMBERS = 4

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if User.objects(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    user = User(email=data['email'], password=data['password'])
    user.save()
    return jsonify({'message': 'User registered successfully'})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.objects(email=data['email'], password=data['password']).first()
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    return jsonify({'message': 'Login successful', 'user_id': str(user.id)})

@app.route('/api/user', methods=['GET'])
def get_user():
    user_id = request.args.get('user_id')
    user = User.objects(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'email': user.email, 'team': str(user.team.id) if user.team else None})

@app.route('/api/team/create', methods=['POST'])
def create_team():
    data = request.json
    user = User.objects(id=data['user_id']).first()
    if not user or user.team:
        return jsonify({'error': 'Already in a team or user not found'}), 400
    team = Team(name=data['team_name'])
    team.members.append(user)
    team.save()
    user.team = team
    user.save()
    return jsonify({'message': 'Team created', 'team_id': str(team.id)})

@app.route('/api/team/add-member', methods=['POST'])
def add_member():
    data = request.json
    user = User.objects(id=data['user_id']).first()
    team = Team.objects(id=data['team_id']).first()

    if not user or not team:
        return jsonify({'error': 'User or team not found'}), 404

    if user.team:
        return jsonify({'error': 'User already in a team'}), 400

    if len(team.members) >= MAX_MEMBERS:
        return jsonify({'error': 'Team is full'}), 403

    team.members.append(user)
    team.save()
    user.team = team
    user.save()
    return jsonify({'message': 'User added to team'})

def process_submission(user, team, code):
    # Check submission limit
    one_hour_ago = datetime.datetime.utcnow() - datetime.timedelta(hours=1)
    submission_count = Submission.objects(team=team, timestamp__gte=one_hour_ago).count()
    if submission_count >= 5:
        return {'error': 'Submission limit reached'}, 429

    # Save submission
    sub = Submission(team=team, user=user, code=code)
    sub.save()

    # Write file to disk
    filename = secure_filename(f"{uuid.uuid4()}_submission.py")
    filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(code)

    user.bot_path = filepath
    user.save()

    # Run match
    result = subprocess.run(
        ["python3", "engine.py", "--p1", filepath, "--p2", "bot1.py"],
        capture_output=True, text=True
    )
    output = result.stdout
    match = Match(user=user, opponent="bot1.py", result="Completed")
    match.save()
    MatchLog(match=match, log=output).save()

    winner_match = re.search(r"Winner:\s*(bot1|bot2)", output)
    winner = winner_match.group(1) if winner_match else "unknown"
    score = 10 if winner == "bot1" else 0

    if user.team:
        user.team.score += score
        user.team.save()

    return {'message': f'Submission successful. You scored {score}', 'score': score}, 200


@app.route('/api/bot/upload', methods=['POST'])
def upload_bot():
    user_id = request.form['user_id']
    user = User.objects(id=user_id).first()
    team = user.team
    file = request.files['bot']

    if file and file.filename.endswith('.py'):
        code = file.read().decode('utf-8')
        return process_submission(user, team, code)

    return jsonify({'error': 'Invalid file'}), 400


@app.route('/api/submission/save', methods=['POST'])
def save_submission():
    data = request.json
    user = User.objects(id=data['user_id']).first()
    team = Team.objects(id=data['team_id']).first()
    return process_submission(user, team, data['code'])


@app.route('/api/submissions', methods=['GET'])
def get_submissions():
    team_id = request.args.get('team_id')
    submissions = Submission.objects(team=team_id).order_by('-timestamp')
    return jsonify([{'_id': str(s.id),'code': s.code, 'time': s.timestamp} for s in submissions])


@app.route('/api/submission/<submission_id>', methods=['GET'])
def get_submission(submission_id):
    sub = Submission.objects(id=submission_id).first()
    if not sub:
        return jsonify({'error': 'Submission not found'}), 404
    return jsonify({'code': sub.code})



@app.route('/api/match/logs', methods=['GET'])
def get_logs():
    user_id = request.args.get('user_id')
    user = User.objects(id=user_id).first()
    matches = Match.objects(user=user).order_by('-timestamp')
    logs = MatchLog.objects(match__in=matches)

    return jsonify([
        {
            'opponent': m.match.opponent,
            'timestamp': m.match.timestamp,
            'log': m.log
        } for m in logs
    ])


@app.route('/api/leaderboard', methods=['GET'])
def leaderboard():
    teams = Team.objects.order_by('-score')
    return jsonify([
        {
            'team': team.name,
            'score': team.score,
            'members': [user.email for user in team.members]
        }
        for team in teams
    ])

if __name__ == '__main__':
    app.run(debug=True)
