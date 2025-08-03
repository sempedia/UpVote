from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Feature(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']  # Fixed: removed vote_count from ordering

    def __str__(self):
        return self.title

    @property
    def vote_count(self):
        """Get total vote count for this feature"""
        return self.votes.count()

    def get_user_vote(self, user_identifier):
        """Check if a user (by IP or ID) has voted for this feature"""
        return self.votes.filter(user_identifier=user_identifier).exists()

class Vote(models.Model):
    feature = models.ForeignKey(Feature, on_delete=models.CASCADE, related_name='votes')
    user_identifier = models.CharField(max_length=100)  # IP address or user ID
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ['feature', 'user_identifier']
        indexes = [
            models.Index(fields=['feature', 'user_identifier']),
        ]

    def __str__(self):
        return f"Vote for {self.feature.title} by {self.user_identifier}"