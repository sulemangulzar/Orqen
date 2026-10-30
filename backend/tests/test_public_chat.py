from app.api.v1.endpoints.public_chat import token_hash


def test_visitor_tokens_are_hashed():
    token = "opaque-visitor-token"
    assert token_hash(token) != token
    assert token_hash(token) == token_hash(token)
