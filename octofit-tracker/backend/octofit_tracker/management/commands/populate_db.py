from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Workout, LeaderboardEntry
from django.utils import timezone

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Borrar datos existentes
        Activity.objects.all().delete()
        Workout.objects.all().delete()
        LeaderboardEntry.objects.all().delete()
        Team.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

        # Crear usuarios
        marvel_heroes = [
            {'username': 'ironman', 'email': 'ironman@marvel.com'},
            {'username': 'spiderman', 'email': 'spiderman@marvel.com'},
            {'username': 'captainmarvel', 'email': 'captainmarvel@marvel.com'},
        ]
        dc_heroes = [
            {'username': 'batman', 'email': 'batman@dc.com'},
            {'username': 'superman', 'email': 'superman@dc.com'},
            {'username': 'wonderwoman', 'email': 'wonderwoman@dc.com'},
        ]
        marvel_users = [User.objects.create_user(**hero, password='test1234') for hero in marvel_heroes]
        dc_users = [User.objects.create_user(**hero, password='test1234') for hero in dc_heroes]

        # Crear equipos
        marvel_team = Team.objects.create(name='Team Marvel')
        marvel_team.members.set(marvel_users)
        dc_team = Team.objects.create(name='Team DC')
        dc_team.members.set(dc_users)

        # Crear actividades
        for user in marvel_users + dc_users:
            Activity.objects.create(
                user=user,
                activity_type='Running',
                duration=30,
                distance=5.0,
                calories=300,
                date=timezone.now().date()
            )

        # Crear workouts
        workout1 = Workout.objects.create(name='Full Body', description='Entrenamiento de cuerpo completo')
        workout2 = Workout.objects.create(name='Cardio Blast', description='Entrenamiento de cardio intenso')
        workout1.suggested_for.set(marvel_users)
        workout2.suggested_for.set(dc_users)

        # Crear leaderboard
        for user, team in zip(marvel_users, [marvel_team]*3):
            LeaderboardEntry.objects.create(user=user, team=team, score=100)
        for user, team in zip(dc_users, [dc_team]*3):
            LeaderboardEntry.objects.create(user=user, team=team, score=90)

        self.stdout.write(self.style.SUCCESS('Test data loaded successfully!'))
