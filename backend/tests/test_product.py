from app.api.v1.endpoints.product import slugify


def test_slugify_normalizes_public_identifiers():
    assert slugify("My Support Assistant!") == "my-support-assistant"


def test_slugify_never_returns_empty():
    assert slugify("!!!")
