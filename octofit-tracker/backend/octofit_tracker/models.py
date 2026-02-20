from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Puedes agregar campos adicionales si es necesario
    pass

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    members = models.ManyToManyField('User', related_name='teams')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Activity(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=100)
    duration = models.PositiveIntegerField(help_text='Duración en minutos')
    distance = models.FloatField(null=True, blank=True, help_text='Distancia en km')
    calories = models.FloatField(null=True, blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.activity_type} ({self.date})"

class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    suggested_for = models.ManyToManyField('User', related_name='suggested_workouts', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class LeaderboardEntry(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    team = models.ForeignKey('Team', on_delete=models.CASCADE, null=True, blank=True)
    score = models.FloatField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'team')

    def __str__(self):
        return f"{self.user.username} - {self.team.name if self.team else 'Individual'}: {self.score}"
