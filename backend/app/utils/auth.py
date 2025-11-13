from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
import bcrypt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from bson import ObjectId

from app.models.auth import TokenData, UserInDB
from app.api.dependencies import get_database
from app.utils.logging import get_logger

logger = get_logger(__name__)

# Security configuration
from app.config import settings

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

# Password hashing
# Initialize CryptContext - wrap bug detection errors are caught during first use
# Use bcrypt directly as fallback to avoid passlib initialization issues
_pwd_context_initialized = False
_pwd_context = None

def _init_pwd_context():
    """Initialize password context with error handling for passlib/bcrypt compatibility issues"""
    global _pwd_context, _pwd_context_initialized
    if not _pwd_context_initialized:
        try:
            _pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            # Try to force initialization by verifying a test hash
            # This may fail due to passlib's wrap bug detection during initialization
            test_hash = bcrypt.hashpw(b"test", bcrypt.gensalt()).decode('utf-8')
            try:
                _pwd_context.verify("test", test_hash)
            except (ValueError, Exception) as e:
                error_msg = str(e)
                # If it's the 72-byte initialization error, mark passlib as unusable
                if "password cannot be longer than 72 bytes" in error_msg:
                    logger.warning("Passlib has initialization issues with bcrypt, will use bcrypt directly")
                    _pwd_context = None
        except Exception as e:
            logger.warning(f"Failed to initialize passlib CryptContext: {e}, will use bcrypt directly")
            _pwd_context = None
        _pwd_context_initialized = True
    return _pwd_context

def get_pwd_context():
    """Get password context, initializing if needed"""
    return _init_pwd_context()

# JWT Bearer token scheme
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    # Bcrypt has a 72-byte limit, so truncate if necessary
    password_bytes = plain_password.encode('utf-8') if isinstance(plain_password, str) else plain_password
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
        plain_password = password_bytes.decode('utf-8', errors='ignore')
    
    # Try passlib first, fallback to bcrypt directly if it fails
    pwd_context = get_pwd_context()
    if pwd_context:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except (ValueError, Exception) as e:
            error_msg = str(e)
            # If it's the 72-byte error from passlib's initialization, use bcrypt directly
            if "password cannot be longer than 72 bytes" in error_msg:
                logger.debug("Passlib failed due to initialization issue, using bcrypt directly")
            else:
                logger.debug(f"Passlib verification failed: {e}, using bcrypt directly")
    
    # Fallback to bcrypt directly
    try:
        # Ensure password is bytes
        password_bytes = plain_password.encode('utf-8') if isinstance(plain_password, str) else plain_password
        if len(password_bytes) > 72:
            password_bytes = password_bytes[:72]
        
        # Ensure hash is bytes
        hash_bytes = hashed_password.encode('utf-8') if isinstance(hashed_password, str) else hashed_password
        
        return bcrypt.checkpw(password_bytes, hash_bytes)
    except Exception as e:
        logger.error(f"Bcrypt verification failed: {e}")
        return False


def get_password_hash(password: str) -> str:
    """Hash a password"""
    # Bcrypt has a 72-byte limit, so truncate if necessary
    password_bytes = password.encode('utf-8') if isinstance(password, str) else password
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
        password = password_bytes.decode('utf-8', errors='ignore')
    
    # Try passlib first, fallback to bcrypt directly if it fails
    pwd_context = get_pwd_context()
    if pwd_context:
        try:
            return pwd_context.hash(password)
        except (ValueError, Exception) as e:
            logger.debug(f"Passlib hashing failed: {e}, using bcrypt directly")
    
    # Fallback to bcrypt directly
    password_bytes = password.encode('utf-8') if isinstance(password, str) else password
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    
    salt = bcrypt.gensalt()
    hash_bytes = bcrypt.hashpw(password_bytes, salt)
    return hash_bytes.decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> TokenData:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return TokenData(username=username, user_id=user_id)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserInDB:
    """Get the current authenticated user"""
    token = credentials.credentials
    token_data = verify_token(token)
    
    db = await get_database()
    user = await db.users.find_one({"username": token_data.username})
    logger.debug(f"User found: {user}")
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Convert MongoDB document to UserInDB model
    user_data = {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "first_name": user.get("first_name"),
        "last_name": user.get("last_name"),
        "is_active": user.get("is_active", True),
        "is_superuser": user.get("is_superuser", False),
        "is_deleted": user.get("is_deleted", False),
        "created_at": user.get("created_at", datetime.utcnow()),
        "updated_at": user.get("updated_at", datetime.utcnow()),
        "deleted_at": user.get("deleted_at"),
        "hashed_password": user.get("hashed_password"),
        # OAuth fields
        "oauth_provider": user.get("oauth_provider", "local"),
        "oauth_id": user.get("oauth_id"),
        # Player statistics fields
        "total_matches": user.get("total_matches", 0),
        "total_goals_scored": user.get("total_goals_scored", 0),
        "total_goals_conceded": user.get("total_goals_conceded", 0),
        "goal_difference": user.get("goal_difference", 0),
        "wins": user.get("wins", 0),
        "losses": user.get("losses", 0),
        "draws": user.get("draws", 0),
        "points": user.get("points", 0),
        # ELO rating and tournament fields
        "elo_rating": user.get("elo_rating", 1200),
        "tournaments_played": user.get("tournaments_played", 0),
        "tournament_ids": user.get("tournament_ids", []),
        # Friend system fields
        "friends": user.get("friends", []),
        "friend_requests_sent": user.get("friend_requests_sent", []),
        "friend_requests_received": user.get("friend_requests_received", []),
        # Team tracking fields
        "last_5_teams": user.get("last_5_teams", []),
    }
    
    return UserInDB(**user_data)


async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
    """Get the current active user"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Check if user is deleted
    if hasattr(current_user, 'is_deleted') and current_user.is_deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account has been deleted"
        )
    
    return current_user


async def get_current_superuser(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
    """Get the current superuser"""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user


def user_helper(user: dict) -> dict:
    """Helper function to format user data"""
    # Check if user is deleted
    is_deleted = user.get("is_deleted", False)
    
    # Get email or provide a default valid email
    email = user.get("email")
    if not email or email == "":
        # Generate a default email based on username for users without email
        username = user.get("username", "unknown")
        email = f"{username}@fifa-tracker.local"
    
    return {
        "id": str(user["_id"]),
        "username": "Deleted Player" if is_deleted else user["username"],
        "email": email,
        "first_name": user.get("first_name"),
        "last_name": user.get("last_name"),
        "is_active": user.get("is_active", True),
        "is_superuser": user.get("is_superuser", False),
        "is_deleted": is_deleted,
        "created_at": user.get("created_at", datetime.utcnow()),
        "updated_at": user.get("updated_at", datetime.utcnow()),
        "deleted_at": user.get("deleted_at"),
        # OAuth fields
        "oauth_provider": user.get("oauth_provider", "local"),
        "oauth_id": user.get("oauth_id"),
        # Player statistics fields
        "total_matches": user.get("total_matches", 0),
        "total_goals_scored": user.get("total_goals_scored", 0),
        "total_goals_conceded": user.get("total_goals_conceded", 0),
        "goal_difference": user.get("goal_difference", 0),
        "wins": user.get("wins", 0),
        "losses": user.get("losses", 0),
        "draws": user.get("draws", 0),
        "points": user.get("points", 0),
        # ELO rating and tournament fields
        "elo_rating": user.get("elo_rating", 1200),
        "tournaments_played": user.get("tournaments_played", 0),
        "tournament_ids": user.get("tournament_ids", []),
        # Friend system fields
        "friends": user.get("friends", []),
        "friend_requests_sent": user.get("friend_requests_sent", []),
        "friend_requests_received": user.get("friend_requests_received", []),
        # Team tracking fields
        "last_5_teams": user.get("last_5_teams", []),
    } 