from rest_framework import serializers
from . import models

class FavoriteThingSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        max_ranking = models.FavoriteThing.objects.count()

        if 'ranking' in validated_data:
            target_ranking = validated_data['ranking']
            category = validated_data['category']


            if target_ranking < 1 or target_ranking > max_ranking + 1:
                raise serializers.ValidationError(
                    {
                        'ranking': ['number is out of ranking range']
                    })

            favorite_things_with_lower_ranking = (
                models
                .FavoriteThing
                .objects
                .filter(
                    category=category,
                    ranking__gte=target_ranking)
            )

            for favorite_thing in favorite_things_with_lower_ranking:
                favorite_thing.ranking = favorite_thing.ranking + 1
                favorite_thing.save()
        else:
            validated_data['ranking'] = max_ranking + 1

        favorite_thing = models.FavoriteThing.objects.create(**validated_data)

        return favorite_thing

    def update(self, instance, validated_data):
        if 'ranking' in validated_data:
            target_ranking = validated_data['ranking']
            category = instance.category
            max_ranking = models.FavoriteThing.objects.count()

            if target_ranking < 1 or target_ranking > max_ranking:
                raise serializers.ValidationError(
                    {
                        'ranking': ['number is out of ranking range']
                    })

            if target_ranking > instance.ranking:
                favorite_things_with_lower_ranking = (
                    models
                    .FavoriteThing
                    .objects
                    .filter(
                        category=category,
                        ranking__gte=instance.ranking,
                        ranking__lte=target_ranking)
                )

                for favorite_thing in favorite_things_with_lower_ranking:
                    if favorite_thing.id != instance.id:
                        favorite_thing.ranking = favorite_thing.ranking - 1
                        favorite_thing.save()

            elif target_ranking < instance.ranking:
                favorite_things_with_higher_ranking = (
                    models
                    .FavoriteThing
                    .objects
                    .filter(
                        category=category,
                        ranking__gte=target_ranking,
                        ranking__lte=instance.ranking)
                )

                for favorite_thing in favorite_things_with_higher_ranking:
                    if favorite_thing.id != instance.id:
                        favorite_thing.ranking = favorite_thing.ranking + 1
                        favorite_thing.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance

    class Meta:
        model = models.FavoriteThing
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    favorite_things = FavoriteThingSerializer(
        many=True,
        read_only=True)

    class Meta:
        model = models.Category
        fields = '__all__'
