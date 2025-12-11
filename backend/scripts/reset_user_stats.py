#!/usr/bin/env python3
"""
Reset User Statistics Script

This script resets all user statistics to their default values and deletes all matches.
This is useful for starting fresh or for development/testing purposes.

Usage:
    python scripts/reset_user_stats.py [--confirm] [--user-id USER_ID]

Options:
    --confirm    Required flag to confirm you want to reset statistics
    --user-id    Reset only specific user ID (optional)
    --help       Show this help message

WARNING: This operation will reset all match-related statistics for users
         AND DELETE ALL MATCHES involving those users.
         This action cannot be easily undone.

Default values:
    - total_matches: 0
    - total_goals_scored: 0
    - total_goals_conceded: 0
    - goal_difference: 0
    - wins: 0
    - losses: 0
    - draws: 0
    - points: 0
    - elo_rating: 1200
    - tournaments_played: 0
    - tournament_ids: []
    - last_5_teams: []
"""

import os
import sys
import argparse
from datetime import datetime
from pathlib import Path
from typing import Optional
import asyncio

# Add the project root to the Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from bson import ObjectId
from app.config import settings
from app.api.dependencies import get_database
from app.utils.logging import get_logger

logger = get_logger(__name__)


class UserStatsResetter:
    """Resets user statistics to default values"""

    def __init__(self):
        self.db = None
        self.default_stats = {
            "total_matches": 0,
            "total_goals_scored": 0,
            "total_goals_conceded": 0,
            "goal_difference": 0,
            "wins": 0,
            "losses": 0,
            "draws": 0,
            "points": 0,
            "elo_rating": settings.DEFAULT_ELO_RATING,
            "tournaments_played": 0,
            "tournament_ids": [],
            "last_5_teams": [],
            "updated_at": datetime.utcnow()
        }
        # Fields to clear/remove
        self.fields_to_unset = {
            "detailed_stats_cache": "",
            "cache_updated_at": ""
        }

    async def initialize(self):
        """Initialize database connection"""
        try:
            self.db = await get_database()
            logger.info("Database connection established")
        except Exception as e:
            logger.error(f"Error initializing database: {str(e)}")
            raise

    async def reset_user_stats(self, user_id: str) -> dict:
        """Reset statistics for a single user and delete their matches"""
        try:
            # Check if user exists
            user = await self.db.users.find_one({"_id": ObjectId(user_id)})
            if not user:
                logger.error(f"User {user_id} not found")
                return {"success": False, "matches_deleted": 0}

            username = user.get("username", "Unknown")

            # Delete all matches involving this user
            delete_result = await self.db.matches.delete_many({
                "$or": [
                    {"player1_id": user_id},
                    {"player2_id": user_id}
                ]
            })
            matches_deleted = delete_result.deleted_count

            # Update user with default stats and clear cache
            result = await self.db.users.update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$set": self.default_stats,
                    "$unset": self.fields_to_unset
                }
            )

            if result.modified_count > 0:
                logger.info(f"✅ Reset statistics for user: {username} (ID: {user_id}), deleted {matches_deleted} matches")
                return {"success": True, "matches_deleted": matches_deleted}
            else:
                logger.warning(f"⚠️ No changes made for user: {username} (ID: {user_id}), deleted {matches_deleted} matches")
                return {"success": False, "matches_deleted": matches_deleted}

        except Exception as e:
            logger.error(f"Error resetting stats for user {user_id}: {str(e)}")
            return {"success": False, "matches_deleted": 0}

    async def reset_all_users_stats(self) -> dict:
        """Reset statistics for all users and delete all their matches"""
        try:
            # Get all users
            cursor = self.db.users.find({})
            users = await cursor.to_list(length=None)

            logger.info(f"Found {len(users)} users to reset")

            success_count = 0
            failed_count = 0
            total_matches_deleted = 0

            for user in users:
                user_id = str(user["_id"])
                result = await self.reset_user_stats(user_id)

                if result["success"]:
                    success_count += 1
                else:
                    failed_count += 1

                total_matches_deleted += result["matches_deleted"]

            return {
                "total_users": len(users),
                "success_count": success_count,
                "failed_count": failed_count,
                "total_matches_deleted": total_matches_deleted
            }

        except Exception as e:
            logger.error(f"Error resetting all users: {str(e)}")
            raise

    def print_summary(self, results: dict):
        """Print summary of reset operation"""
        print("\n" + "="*60)
        print("USER STATISTICS RESET SUMMARY")
        print("="*60)
        print(f"📊 Total users processed: {results['total_users']}")
        print(f"✅ Successfully reset: {results['success_count']}")
        print(f"❌ Failed: {results['failed_count']}")
        print(f"🗑️  Total matches deleted: {results.get('total_matches_deleted', 0)}")
        print("="*60)
        print("\nDefault values applied:")
        print(f"  - total_matches: 0")
        print(f"  - total_goals_scored: 0")
        print(f"  - total_goals_conceded: 0")
        print(f"  - goal_difference: 0")
        print(f"  - wins: 0")
        print(f"  - losses: 0")
        print(f"  - draws: 0")
        print(f"  - points: 0")
        print(f"  - elo_rating: {settings.DEFAULT_ELO_RATING}")
        print(f"  - tournaments_played: 0")
        print(f"  - tournament_ids: []")
        print(f"  - last_5_teams: []")
        print(f"\n🕒 Reset completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


async def main():
    """Main function"""
    parser = argparse.ArgumentParser(
        description="Reset user statistics to default values and delete all matches",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
WARNING: This operation will reset all match-related statistics for users
         AND DELETE ALL MATCHES involving those users.
         This action cannot be easily undone. Use with caution!

Examples:
    # Reset all users (requires --confirm)
    python scripts/reset_user_stats.py --confirm

    # Reset specific user
    python scripts/reset_user_stats.py --confirm --user-id 507f1f77bcf86cd799439011
        """
    )
    parser.add_argument(
        "--confirm",
        action="store_true",
        help="Required flag to confirm you want to reset statistics"
    )
    parser.add_argument(
        "--user-id",
        type=str,
        help="Reset only specific user ID"
    )

    args = parser.parse_args()

    # Require confirmation
    if not args.confirm:
        print("\n⚠️  ERROR: You must use the --confirm flag to run this script.")
        print("This operation will reset user statistics and DELETE ALL MATCHES.")
        print("This action cannot be easily undone.")
        print("\nUsage: python scripts/reset_user_stats.py --confirm")
        sys.exit(1)

    try:
        resetter = UserStatsResetter()
        await resetter.initialize()

        if args.user_id:
            # Reset single user
            print(f"\n⚠️  You are about to reset statistics for user ID: {args.user_id}")
            print("This will set all match-related statistics to their default values.")
            print("All matches involving this user will also be DELETED.")

            confirm = input("\nType 'YES' to confirm: ")
            if confirm != "YES":
                print("❌ Operation cancelled")
                sys.exit(0)

            logger.info(f"Resetting statistics for user: {args.user_id}")
            result = await resetter.reset_user_stats(args.user_id)

            if result["success"]:
                print(f"\n✅ Successfully reset statistics for user {args.user_id}")
                print(f"🗑️  Deleted {result['matches_deleted']} matches")
                results = {
                    "total_users": 1,
                    "success_count": 1,
                    "failed_count": 0,
                    "total_matches_deleted": result["matches_deleted"]
                }
                resetter.print_summary(results)
            else:
                print(f"\n❌ Failed to reset statistics for user {args.user_id}")
                if result["matches_deleted"] > 0:
                    print(f"⚠️  {result['matches_deleted']} matches were deleted before failure")
                sys.exit(1)
        else:
            # Reset all users
            # Get count first
            user_count = await resetter.db.users.count_documents({})
            match_count = await resetter.db.matches.count_documents({})

            print(f"\n⚠️  WARNING: You are about to reset statistics for ALL {user_count} users!")
            print("This will set all match-related statistics to their default values.")
            print(f"ALL {match_count} matches will also be PERMANENTLY DELETED.")
            print("This operation cannot be easily undone.")

            confirm = input("\nType 'YES' to confirm: ")
            if confirm != "YES":
                print("❌ Operation cancelled")
                sys.exit(0)

            logger.info("Resetting statistics for all users...")
            results = await resetter.reset_all_users_stats()
            resetter.print_summary(results)

    except KeyboardInterrupt:
        logger.info("Reset operation interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Reset operation failed: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
