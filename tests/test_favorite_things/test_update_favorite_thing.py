from rest_framework.test import APIClient
import pytest
import json

from api.models import Category, FavoriteThing

@pytest.mark.django_db
def test_update_favorite_thing_validation(client):
    category = Category(name="Food")
    category.save()

    favorite_thing = FavoriteThing(
        title="Rice",
        category=category,
        ranking=1)
    favorite_thing.save()

    response = client.patch(
        '/api/v1/favorite-things/{}/'.format(str(favorite_thing.id)),
        {
            'ranking': {}
        },
        content_type='application/json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 400
    assert content == {'ranking': ['A valid integer is required.']}

@pytest.mark.django_db
def test_update_favorite_thing(client):
    category = Category(name="Food")
    category.save()

    favorite_thing = FavoriteThing(
        title="Rice",
        category=category,
        ranking=1)
    favorite_thing.save()

    response = client.patch(
        '/api/v1/favorite-things/{}/'.format(str(favorite_thing.id)),
        {
            'title': 'Koko'
        },
        content_type='application/json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 200
    assert content['title'] == 'Koko'


@pytest.mark.django_db
def test_update_favorite_thing_ranking_without_category(client):
    category = Category(name="Food")
    category.save()

    favorite_thing = FavoriteThing(
        title="Rice",
        category=category,
        ranking=1)
    favorite_thing.save()
    second_favorite_thing = FavoriteThing(
        title="Beans",
        category=category,
        ranking=2)
    second_favorite_thing.save()
    third_favorite_thing = FavoriteThing(
        title="soup",
        category=category,
        ranking=3)
    third_favorite_thing.save()

    response = client.patch(
        '/api/v1/favorite-things/{}/'.format(str(favorite_thing.id)),
        {
            'ranking': 5
        },
        content_type='application/json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 400
    assert content == { 'ranking': ['number is out of ranking range'] }

    response = client.patch(
        '/api/v1/favorite-things/{}/'.format(str(second_favorite_thing.id)),
        {
            'ranking': 3
        },
        content_type='application/json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 200
    assert content['ranking'] == 3

    third_favorite_thing.refresh_from_db()
    assert third_favorite_thing.ranking == 2

    response = client.patch(
        '/api/v1/favorite-things/{}/'.format(str(third_favorite_thing.id)),
        {
            'ranking': 1
        },
        content_type='application/json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 200
    assert content['ranking'] == 1

    third_favorite_thing.refresh_from_db()
    assert third_favorite_thing.ranking == 1



@pytest.mark.django_db
def test_update_favorite_thing_ranking_with_category(client):
    food_category = Category(name="Food")
    food_category.save()

    shoe_category = Category(name="Shoes")
    shoe_category.save()

    favorite_food = FavoriteThing(
        title="Rice",
        category=food_category,
        ranking=1)
    favorite_food.save()
    second_favorite_food = FavoriteThing(
        title="Beans",
        category=food_category,
        ranking=2)
    second_favorite_food.save()
    third_favorite_food = FavoriteThing(
        title="soup",
        category=food_category,
        ranking=3)
    third_favorite_food.save()


    favorite_shoe = FavoriteThing(
        title="Slippers",
        category=shoe_category,
        ranking=1)
    favorite_shoe.save()
    second_favorite_shoe = FavoriteThing(
        title="Beans",
        category=shoe_category,
        ranking=2)
    second_favorite_shoe.save()
    third_favorite_shoe = FavoriteThing(
        title="soup",
        category=shoe_category,
        ranking=3)
    third_favorite_shoe.save()

    response = client.patch(
        '/api/v1/favorite-things/{}/'.format(str(second_favorite_shoe.id)),
        {
            'ranking': 2,
            'category': str(food_category.id)
        },
        content_type='application/json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 200
    assert content['category'] == str(food_category.id)

    second_favorite_food.refresh_from_db()
    assert second_favorite_food.ranking == 3

    third_favorite_shoe.refresh_from_db()
    assert third_favorite_shoe.ranking == 2

@pytest.mark.django_db
def test_update_favorite_thing_ranking_range_with_category(client):
    food_category = Category(name="Food")
    food_category.save()

    shoe_category = Category(name="Shoes")
    shoe_category.save()

    favorite_food = FavoriteThing(
        title="Rice",
        category=food_category,
        ranking=1)
    favorite_food.save()
    second_favorite_food = FavoriteThing(
        title="Beans",
        category=food_category,
        ranking=2)
    second_favorite_food.save()
    third_favorite_food = FavoriteThing(
        title="soup",
        category=food_category,
        ranking=3)
    third_favorite_food.save()


    favorite_shoe = FavoriteThing(
        title="Slippers",
        category=shoe_category,
        ranking=1)
    favorite_shoe.save()
    second_favorite_shoe = FavoriteThing(
        title="Beans",
        category=shoe_category,
        ranking=2)
    second_favorite_shoe.save()
    third_favorite_shoe = FavoriteThing(
        title="soup",
        category=shoe_category,
        ranking=3)
    third_favorite_shoe.save()

    response = client.patch(
        '/api/v1/favorite-things/{}/'.format(str(second_favorite_shoe.id)),
        {
            'ranking': 6,
            'category': str(food_category.id)
        },
        content_type='application/json'
    )

    content = json.loads(response.content.decode("utf-8"))

    assert response.status_code == 400
    assert content == { 'ranking': ['number is out of ranking range'] }
