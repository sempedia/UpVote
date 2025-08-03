from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import IntegrityError
from .models import Feature, Vote
from .serializers import FeatureSerializer, FeatureListSerializer

class FeatureListCreateView(generics.ListCreateAPIView):
    queryset = Feature.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return FeatureListSerializer
        return FeatureSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class FeatureDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Feature.objects.all()
    serializer_class = FeatureSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

@api_view(['POST'])
def upvote_feature(request, pk):
    """Upvote a specific feature (one vote per user)"""
    try:
        feature = Feature.objects.get(pk=pk)
    except Feature.DoesNotExist:
        return Response(
            {'error': 'Feature not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Get user identifier (IP address for anonymous users)
    user_identifier = get_user_identifier(request)

    try:
        # Try to create a vote (will fail if user already voted due to unique constraint)
        vote = Vote.objects.create(
            feature=feature,
            user_identifier=user_identifier
        )

        # Return updated feature data
        serializer = FeatureSerializer(feature, context={'request': request})
        return Response({
            'message': 'Vote added successfully',
            'feature': serializer.data
        }, status=status.HTTP_201_CREATED)

    except IntegrityError:
        # User has already voted for this feature
        return Response(
            {'error': 'You have already voted for this feature'},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['DELETE'])
def remove_vote(request, pk):
    """Remove a vote from a feature"""
    try:
        feature = Feature.objects.get(pk=pk)
    except Feature.DoesNotExist:
        return Response(
            {'error': 'Feature not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    user_identifier = get_user_identifier(request)

    try:
        vote = Vote.objects.get(feature=feature, user_identifier=user_identifier)
        vote.delete()

        serializer = FeatureSerializer(feature, context={'request': request})
        return Response({
            'message': 'Vote removed successfully',
            'feature': serializer.data
        })

    except Vote.DoesNotExist:
        return Response(
            {'error': 'You have not voted for this feature'},
            status=status.HTTP_400_BAD_REQUEST
        )

def get_user_identifier(request):
    """Get user identifier (IP address for anonymous users)"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip or 'unknown'

@api_view(['GET'])
def feature_stats(request, pk):
    """Get detailed stats for a feature"""
    try:
        feature = Feature.objects.get(pk=pk)
    except Feature.DoesNotExist:
        return Response(
            {'error': 'Feature not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    recent_votes = feature.votes.order_by('-created_at')[:10]

    return Response({
        'feature_id': feature.id,
        'title': feature.title,
        'total_votes': feature.vote_count,
        'recent_votes': [
            {
                'user_identifier': vote.user_identifier[:10] + '...',  # Partial IP for privacy
                'created_at': vote.created_at
            } for vote in recent_votes
        ]
    })