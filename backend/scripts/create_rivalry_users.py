#!/usr/bin/env python3
"""
Script to create specific rivalry tracker users.
Creates users: roshatron, shinigami, and kAMi with password "password"
"""

import asyncio
import sys
import os
from pathlib import Path
from typing import List

# Add the app directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

# Import settings FIRST and override MONGO_URI BEFORE importing dependencies
# This ensures the MongoDB client uses the correct URI when it's lazily initialized
from app.config import settings

# Override MONGO_URI for local script execution
# This script always runs locally, so use localhost instead of Docker service name
if settings.MONGO_URI and "mongodb://mongodb:" in settings.MONGO_URI:
    # Replace Docker service name with localhost for local execution
    settings.MONGO_URI = settings.MONGO_URI.replace("mongodb://mongodb:", "mongodb://localhost:")

# Now import dependencies - MongoDB client will be created lazily with the updated URI
from app.api.dependencies import get_database
from app.utils.auth import get_password_hash
from app.utils.logging import get_logger
from datetime import datetime, timezone
from bson import ObjectId

logger = get_logger(__name__)


async def create_user(username: str, email: str, first_name: str, last_name: str = "", is_superuser: bool = False):
    """Create a user with the specified details. Returns the user ID."""
    db = await get_database()
    print(f"Database name: {db.name}")
    
    # Check if user already exists
    existing_user = await db.users.find_one({"username": username})
    if existing_user:
        logger.info(f"✅ User '{username}' already exists!")
        return str(existing_user["_id"])
    
    # Create user data
    user_data = {
        "username": username,
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "hashed_password": get_password_hash("password"),
        "is_active": True,
        "is_superuser": is_superuser,
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "deleted_at": None,
        # Initialize player statistics
        "total_matches": 0,
        "total_goals_scored": 0,
        "total_goals_conceded": 0,
        "goal_difference": 0,
        "wins": 0,
        "losses": 0,
        "draws": 0,
        "points": 0,
        # ELO rating and tournament fields
        "elo_rating": 1200,
        "tournaments_played": 0,
        "tournament_ids": [],
        # Friend system fields
        "friends": [],
        "friend_requests_sent": [],
        "friend_requests_received": []
    }
    
    # Insert user
    result = await db.users.insert_one(user_data)
    
    if result.inserted_id:
        logger.info(f"✅ User '{username}' created successfully!")
        logger.info(f"   Email: {email}")
        logger.info(f"   Password: password")
        logger.info(f"   Superuser: {is_superuser}")
        return str(result.inserted_id)
    else:
        logger.error(f"❌ Failed to create user '{username}'")
        return None


async def make_users_friends(user_ids: List[str]):
    """Make all users in the list friends with each other"""
    if len(user_ids) < 2:
        logger.info("Not enough users to create friendships")
        return
    
    db = await get_database()
    
    # Create all pairs of users
    pairs_created = 0
    for i, user_id_1 in enumerate(user_ids):
        for user_id_2 in user_ids[i + 1:]:
            # Add user_id_2 to user_id_1's friends list
            await db.users.update_one(
                {"_id": ObjectId(user_id_1)},
                {
                    "$addToSet": {"friends": user_id_2},
                    "$set": {"updated_at": datetime.now(timezone.utc)}
                }
            )
            
            # Add user_id_1 to user_id_2's friends list
            await db.users.update_one(
                {"_id": ObjectId(user_id_2)},
                {
                    "$addToSet": {"friends": user_id_1},
                    "$set": {"updated_at": datetime.now(timezone.utc)}
                }
            )
            pairs_created += 1
    
    logger.info(f"✅ Created {pairs_created} friendship pairs between all users!")


async def main():
    """Main function to create rivalry users"""
    logger.info("🚀 Creating FIFA Rivalry Tracker users...")
    print(f"📊 MONGO_URI: {settings.MONGO_URI}")
    logger.info(f"📊 MONGO_URI: {settings.MONGO_URI}")
    
    try:
        # Create the three specified users and collect their IDs
        user_ids = []
        
        user_id = await create_user(
            username="roshatron",
            email="roshatron@fifa-tracker.com",
            first_name="Roshan",
            last_name="",
            is_superuser=False  # Making roshatron a superuser
        )
        if user_id:
            user_ids.append(user_id)
        
        user_id = await create_user(
            username="shinigami",
            email="shinigami@fifa-tracker.com",
            first_name="Ajay",
            last_name="Krishnan",
            is_superuser=False
        )
        if user_id:
            user_ids.append(user_id)
        
        user_id = await create_user(
            username="kAMi",
            email="kami@fifa-tracker.com",
            first_name="Ankush",
            last_name="Malaker",
            is_superuser=False
        )
        if user_id:
            user_ids.append(user_id)

        user_id = await create_user(
            username="funhaver",
            email="funhaver@fifa-tracker.com",
            first_name="Prayag",
            last_name="VA",
            is_superuser=False
        )
        if user_id:
            user_ids.append(user_id)
        
        # Make all users friends with each other
        if len(user_ids) > 1:
            logger.info("🔗 Making all users friends with each other...")
            await make_users_friends(user_ids)
        
        logger.info("🎉 All rivalry users created successfully!")
        logger.info("📋 Summary:")
        logger.info("   - roshatron (Superuser)")
        logger.info("   - shinigami")
        logger.info("   - kAMi")
        logger.info("   - funhaver")
        logger.info("   All users have password: 'password'")
        logger.info("   All users are now friends with each other!")
        logger.info("")
        logger.info("You can now:")
        logger.info("1. Login at /api/v1/auth/login with any of these users")
        logger.info("2. Use JWT tokens to access protected endpoints")
        logger.warning("⚠️  Consider changing passwords in production!")
        
    except Exception as e:
        logger.error(f"❌ Error creating users: {str(e)}")
        logger.error("Make sure your MongoDB connection is working and .env file is configured.")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
