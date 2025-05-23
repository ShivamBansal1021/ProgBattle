from mongoengine import Document, StringField, ReferenceField, ListField, IntField, DateTimeField
import datetime

class User(Document):
    email = StringField(required=True, unique=True)
    password = StringField(required=True)
    team = ReferenceField('Team', default=None)
    bot_path = StringField()

class Team(Document):
    name = StringField(required=True, unique=True)
    members = ListField(ReferenceField(User))
    score = IntField(default=0)

class Match(Document):
    user = ReferenceField(User)
    opponent = StringField()
    result = StringField()
    timestamp = DateTimeField(default=datetime.datetime.utcnow)

class Submission(Document):
    team = ReferenceField(Team, required=True)
    user = ReferenceField(User)
    code = StringField(required=True)
    timestamp = DateTimeField(default=datetime.datetime.utcnow)

class MatchLog(Document):
    match = ReferenceField(Match)
    log = StringField()