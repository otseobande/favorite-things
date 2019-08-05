from rest_framework import serializers
from django.db.models import F
from auditlog.models import LogEntry
from . import models

class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = '__all__'

class FavoriteThingSerializer(serializers.ModelSerializer):
    history = LogEntrySerializer(many=True, read_only=True)

    def create(self, validated_data):
        target_ranking = validated_data['ranking']
        category = validated_data['category']
        max_ranking = models.FavoriteThing.objects.filter(
            category=category
        ).count()

        if 'ranking' in validated_data:
            if target_ranking < 1 or target_ranking > max_ranking + 1:
                raise serializers.ValidationError(
                    {
                        'ranking': ['number is out of ranking range']
                    })

            (
                models
                .FavoriteThing
                .objects
                .filter(
                    category=category,
                    ranking__gte=target_ranking
                )
                .update(ranking=F('ranking') + 1)
            )

        else:
            validated_data['ranking'] = max_ranking + 1

        favorite_thing = models.FavoriteThing.objects.create(**validated_data)

        return favorite_thing

    def update(self, instance, validated_data):
        if 'ranking' in validated_data and not 'category' in validated_data:
            target_ranking = validated_data['ranking']
            category = instance.category
            max_ranking = models.FavoriteThing.objects.count()

            if target_ranking < 1 or target_ranking > max_ranking:
                raise serializers.ValidationError(
                    {
                        'ranking': ['number is out of ranking range']
                    })

            if target_ranking > instance.ranking:
                (
                    models
                    .FavoriteThing
                    .objects
                    .filter(
                        category=category,
                        ranking__gte=instance.ranking,
                        ranking__lte=target_ranking
                    )
                    .exclude(id=instance.id)
                    .update(ranking=F('ranking') - 1)
                )

            elif target_ranking < instance.ranking:
                (
                    models
                    .FavoriteThing
                    .objects
                    .filter(
                        category=category,
                        ranking__gte=target_ranking,
                        ranking__lte=instance.ranking
                    )
                    .exclude(id=instance.id)
                    .update(ranking=F('ranking') + 1)
                )

        elif 'ranking' in validated_data and 'category' in validated_data:
            category = validated_data['category']
            ranking = validated_data['ranking']

            (
                models
                .FavoriteThing
                .objects
                .filter(
                    category=instance.category,
                    ranking__gt=instance.ranking
                )
                .update(ranking=F('ranking') -  1)
            )

            category = validated_data['category']
            max_ranking = models.FavoriteThing.objects.filter(
                category=category
            ).count()

            if ranking < 1 or ranking > max_ranking + 1:
                raise serializers.ValidationError(
                    {
                        'ranking': ['number is out of ranking range']
                    })

            (
                models
                .FavoriteThing
                .objects
                .filter(
                    category=category,
                    ranking__gte=ranking
                )
                .update(ranking=F('ranking') +  1)
            )

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save(update_fields=validated_data.keys())

        return instance

    class Meta:
        model = models.FavoriteThing
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    favorite_things = FavoriteThingSerializer(
        many=True,
        read_only=True)

    history = LogEntrySerializer(many=True, read_only=True)

    def get_history(self, obj):
        return json.dumps(obj.history.all())


    class Meta:
        model = models.Category
        fields = '__all__'
