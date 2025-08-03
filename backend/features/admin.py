from django.contrib import admin
from .models import Feature, Vote

@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ['title', 'vote_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at', 'vote_count']

    def vote_count(self, obj):
        return obj.vote_count
    vote_count.short_description = 'Votes'

@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ['feature', 'user_identifier', 'created_at']
    list_filter = ['created_at', 'feature']
    search_fields = ['feature__title', 'user_identifier']
    readonly_fields = ['created_at']
