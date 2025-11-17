# # backend/app.py
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from qdrant_client import QdrantClient
# from qdrant_client.http.models import Distance, VectorParams, PointStruct
# from sentence_transformers import SentenceTransformer
# import uuid

# app = FastAPI()

# # Allow React Native to talk to backend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Qdrant: In-memory (no Docker, no file)
# client = QdrantClient(":memory:")
# embedder = SentenceTransformer('all-MiniLM-L6-v2')

# COLLECTION = "transit_memory_db"
# if not client.collection_exists(COLLECTION):
#     client.create_collection(
#         collection_name=COLLECTION,
#         vectors_config=VectorParams(size=384, distance=Distance.COSINE),
#     )

# class Preference(BaseModel):
#     userId: str
#     key: str
#     value: str

# @app.post("/store-preference")
# async def store(pref: Preference):
#     text = f"User's {pref.key}: {pref.value}"
#     vector = embedder.encode(text).tolist()
#     point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{pref.userId}_{pref.key}"))
    
#     client.upsert(
#         collection_name=COLLECTION,
#         points=[PointStruct(
#             id=point_id,
#             vector=vector,
#             payload={
#                 "type": "USER_PREF",
#                 "user_id": pref.userId,
#                 pref.key: pref.value
#             }
#         )]
#     )
#     return {"status": "saved"}

# @app.get("/get-prefs/{user_id}")
# async def get_prefs(user_id: str):
#     # Mock semantic search
#     query = "user preferences crowd seating anxiety wait time"
#     vector = embedder.encode(query).tolist()
#     results = client.search(
#         collection_name=COLLECTION,
#         query_vector=vector,
#         query_filter={"must": [{"key": "user_id", "match": {"value": user_id}}]},
#         limit=10
#     )
#     prefs = {}
#     for hit in results:
#         payload = hit.payload
#         for k, v in payload.items():
#             if k not in ["type", "user_id"]:
#                 prefs[k] = v
#     return prefs

# print("Qdrant backend ready! Run: uvicorn app:app --reload")

# backend/app.py
# backend/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Qdrant in-memory
client = QdrantClient(":memory:")
embedder = SentenceTransformer('all-MiniLM-L6-v2')

COLLECTION = "transit_memory_db"
if not client.collection_exists(COLLECTION):
    client.create_collection(
        collection_name=COLLECTION,
        vectors_config=VectorParams(size=384, distance=Distance.COSINE),
    )

class Preference(BaseModel):
    userId: str
    key: str
    value: str

@app.get("/store-preference")
async def store_get():
    return {"error": "Use POST to save data"}

@app.post("/store-preference")
async def store(pref: Preference):
    text = f"User's {pref.key}: {pref.value}"
    vector = embedder.encode(text).tolist()
    point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{pref.userId}_{pref.key}"))
    
    client.upsert(
        collection_name=COLLECTION,
        points=[PointStruct(
            id=point_id,
            vector=vector,
            payload={
                "type": "USER_PREF",
                "user_id": pref.userId,
                pref.key: pref.value
            }
        )]
    )
    return {"status": "saved"}

@app.get("/get-prefs/{user_id}")
async def get_prefs(user_id: str):
    query = "user preferences crowd seating anxiety wait time"
    vector = embedder.encode(query).tolist()
    results = client.search(collection_name=COLLECTION, query_vector=vector, limit=10)
    prefs = {}
    for hit in results:
        p = hit.payload
        if p.get("user_id") == user_id and p.get("type") == "USER_PREF":
            for k, v in p.items():
                if k not in ["type", "user_id"]:
                    prefs[k] = v
    return prefs

@app.post("/process-query")
async def process_query(data: dict):
    query = data.get("query", "").lower()
    needs_vision = any(word in query for word in ["bus", "platform", "crowd", "seat", "smell"])
    return {"needsVision": needs_vision}

@app.post("/fusion")
async def fusion(data: dict):
    user_id = data.get("userId")
    query = data.get("query", "")
    image_data = data.get("image", "")  # <-- This is the Base64 image string

    # --- 🔍 CHECK DATA ARRIVAL HERE ---
    print("\n--- INCOMING FUSION DATA ---")
    print(f"User ID: {user_id}")
    print(f"Query: {query}")
    
    # Check if the image data is present and its size
    if image_data:
        print(f"Image Data Size: {len(image_data)} characters")
        print(f"Image Data Starts With: {image_data[:30]}...") 
    else:
        print("Image Data: MISSING")
    print("--------------------------\n")
    # -----------------------------------

    prefs = await get_prefs(user_id)
    user_id = data.get("userId")
    query = data.get("query", "")
    image = data.get("image", "")

    prefs = await get_prefs(user_id)
    vision_result = "Bus 101 is here. Crowd: medium. Seat: front available."

    instruction = f"{vision_result} "
    if prefs.get("crowdTolerance", "10") < "5":
        instruction += "Avoid front due to crowd anxiety. "
    if prefs.get("seatingPreference") == "rear":
        instruction += "Go to rear for safety. "

    return {"instruction": instruction.strip()}