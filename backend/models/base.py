from bson import ObjectId
from pydantic import BaseModel, Field, GetCoreSchemaHandler
from pydantic_core import core_schema
from typing import Any, Optional
from datetime import datetime


# ---------------------------------------------------------------------------
# Sérialisation ObjectId ↔ str pour Pydantic v2
# ---------------------------------------------------------------------------
class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler: GetCoreSchemaHandler):
        return core_schema.no_info_plain_validator_function(cls.validate)

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        if isinstance(v, str) and ObjectId.is_valid(v):
            return v
        raise ValueError(f"Invalid ObjectId: {v}")

    @classmethod
    def __get_validators__(cls):          # compat pydantic v1
        yield cls.validate


# ---------------------------------------------------------------------------
# Classe de base commune à tous les documents MongoDB
# ---------------------------------------------------------------------------
class MongoBaseModel(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    model_config = {
        "populate_by_name": True,       # accepte alias ET nom python
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str},
    }