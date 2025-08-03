from rest_framework import serializers
from .models import Feature, Vote

class FeatureSerializer(serializers.ModelSerializer):
    vote_count = serializers.ReadOnlyField()
    user_has_voted = serializers.SerializerMethodField()

    class Meta:
        model = Feature
        fields = ['id', 'title', 'description', 'vote_count', 'user_has_voted', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_user_has_voted(self, obj):
        """Check if current user has voted for this feature"""
        request = self.context.get('request')
        if request:
            user_identifier = self.get_user_identifier(request)
            return obj.get_user_vote(user_identifier)
        return False

    def get_user_identifier(self, request):
        """Get user identifier (IP address for anonymous users)"""
        # For now, we'll use IP address as identifier
        # In a real app, you'd use request.user.id for authenticated users
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip or 'unknown'

class FeatureListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list view"""
    vote_count = serializers.ReadOnlyField()

    class Meta:
        model = Feature
        fields = ['id', 'title', 'description', 'vote_count', 'created_at']

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'feature', 'user_identifier', 'created_at']
        read_only_fields = ['id', 'user_identifier', 'created_at']